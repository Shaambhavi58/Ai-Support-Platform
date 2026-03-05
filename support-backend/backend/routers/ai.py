from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from groq import Groq
import os
from db.database import get_db
from models.user import User
from models.message import Message, ChatSession
from models.ticket import Ticket
from schemas.schemas import AIRequest, AIResponse, ChatRequest
from core.security import get_current_user
from core.config import settings
import json, uuid

router = APIRouter(prefix="/api/ai", tags=["ai"])

def get_groq_client():
    api_key = getattr(settings, 'GROQ_API_KEY', None) or os.getenv('GROQ_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
    return Groq(api_key=api_key)

def call_groq(messages: list, system: str) -> str:
    client = get_groq_client()
    all_messages = [{"role": "system", "content": system}] + messages
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=all_messages,
        max_tokens=1000,
        temperature=0.7,
    )
    return response.choices[0].message.content

SYSTEM_PROMPTS = {
    "reply": lambda tone: f"You are an expert customer support agent. Generate a {tone} reply for the described ticket. Include empathy, clear resolution steps, and a professional sign-off as 'Support Team'.",
    "summary": lambda tone: "You are a support operations expert. Summarize the conversation thread in 3-4 bullet points: main issue, steps taken, current status, recommended next action.",
    "macro": lambda tone: f"You are creating a reusable support macro template. Generate a flexible response with [PLACEHOLDERS] for the issue type described. Tone: {tone}.",
    "escalation": lambda tone: "You are a support quality analyst. Analyze if this situation requires escalation. Rate urgency 1-5, identify escalation signals, and recommend the next action.",
}

@router.post("/generate", response_model=AIResponse)
async def generate_response(
    data: AIRequest,
    current_user: User = Depends(get_current_user),
):
    system = SYSTEM_PROMPTS.get(data.template, SYSTEM_PROMPTS["reply"])(data.tone)
    result = call_groq([{"role": "user", "content": data.prompt}], system)
    return {"result": result}

@router.post("/suggest/{ticket_id}", response_model=AIResponse)
async def suggest_reply(
    ticket_id: int,
    tone: str = "professional",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    messages = db.query(Message).filter(Message.ticket_id == ticket_id).order_by(Message.created_at).all()
    conversation = "\n".join([f"{'Customer' if m.is_customer else 'Agent'}: {m.content}" for m in messages])

    prompt = f"""
Ticket: {ticket.ticket_number}
Subject: {ticket.subject}
Customer: {ticket.customer_name} ({ticket.customer_email})
Category: {ticket.category}
Priority: {ticket.priority}

Conversation:
{conversation or 'No messages yet.'}
    """
    system = f"You are an expert customer support agent. Generate a {tone}, empathetic, and helpful reply to this support ticket. Be concise (3-5 sentences). Sign off as 'Support Team'."
    result = call_groq([{"role": "user", "content": prompt}], system)

    # Save AI message to DB
    ai_msg = Message(ticket_id=ticket_id, content=result, is_customer=False, is_ai_generated=True, author_id=current_user.id)
    db.add(ai_msg)
    db.commit()

    return {"result": result}

@router.post("/chat")
async def chat(
    data: ChatRequest,
    db: Session = Depends(get_db),
):
    system = "You are a friendly, efficient AI customer support agent for a SaaS platform. Be concise, helpful, and professional. If you don't know something specific, offer to escalate to a human agent."
    messages = [{"role": m.role, "content": m.content} for m in data.messages]
    result = call_groq(messages, system)

    # Persist session
    session_id = data.session_id or str(uuid.uuid4())
    session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
    if not session:
        session = ChatSession(session_id=session_id, messages=json.dumps(messages))
        db.add(session)
    else:
        existing = json.loads(session.messages)
        existing.append({"role": "assistant", "content": result})
        session.messages = json.dumps(existing)
    db.commit()

    return {"result": result, "session_id": session_id}

@router.post("/kb-search", response_model=AIResponse)
async def kb_search_tip(
    data: AIRequest,
    current_user: User = Depends(get_current_user),
):
    system = "You are a knowledge base search assistant. Based on the search query, provide a 1-2 sentence helpful tip about what the user might need. Be concise and practical."
    result = call_groq([{"role": "user", "content": data.prompt}], system)
    return {"result": result}

@router.post("/kb-article", response_model=AIResponse)
async def generate_kb_article(
    data: AIRequest,
    current_user: User = Depends(get_current_user),
):
    system = "You are a technical writer for a SaaS product. Write a complete, helpful support article with an introduction, 2-3 steps or sections, and a closing tip. Use plain language. Keep it under 300 words."
    result = call_groq([{"role": "user", "content": data.prompt}], system)
    return {"result": result}
