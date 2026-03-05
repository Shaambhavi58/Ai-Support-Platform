from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional
from datetime import datetime, date
from db.database import get_db
from models.ticket import Ticket, TicketStatus
from models.message import Message
from models.user import User
from schemas.schemas import TicketCreate, TicketUpdate, TicketOut, TicketListOut, MessageCreate, MessageOut
from core.security import get_current_user

router = APIRouter(prefix="/api/tickets", tags=["tickets"])

def generate_ticket_number(db: Session) -> str:
    count = db.query(Ticket).count()
    return f"TKT-{str(count + 1).zfill(3)}"

@router.get("", response_model=list[TicketListOut])
def list_tickets(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Ticket)
    if status:
        q = q.filter(Ticket.status == status)
    if priority:
        q = q.filter(Ticket.priority == priority)
    if category:
        q = q.filter(Ticket.category == category)
    if search:
        q = q.filter(
            Ticket.subject.ilike(f"%{search}%") |
            Ticket.customer_name.ilike(f"%{search}%") |
            Ticket.customer_email.ilike(f"%{search}%")
        )
    tickets = q.order_by(Ticket.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for t in tickets:
        msg_count = db.query(Message).filter(Message.ticket_id == t.id).count()
        t_dict = {
            "id": t.id, "ticket_number": t.ticket_number, "subject": t.subject,
            "customer_name": t.customer_name, "customer_email": t.customer_email,
            "status": t.status, "priority": t.priority, "category": t.category,
            "assigned_to": t.assigned_to, "created_at": t.created_at, "message_count": msg_count,
        }
        result.append(t_dict)
    return result

@router.post("", response_model=TicketOut, status_code=201)
def create_ticket(data: TicketCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = Ticket(
        ticket_number=generate_ticket_number(db),
        subject=data.subject,
        description=data.description,
        customer_name=data.customer_name,
        customer_email=data.customer_email,
        priority=data.priority,
        category=data.category,
        created_by=current_user.id,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.get("/{ticket_id}", response_model=TicketOut)
def get_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = db.query(Ticket).options(
        joinedload(Ticket.messages).joinedload(Message.author),
        joinedload(Ticket.assigned_agent)
    ).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.patch("/{ticket_id}", response_model=TicketOut)
def update_ticket(ticket_id: int, data: TicketUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    for field, val in data.model_dump(exclude_none=True).items():
        setattr(ticket, field, val)
    if data.status == TicketStatus.closed:
        ticket.closed_at = datetime.utcnow()
    db.commit()
    db.refresh(ticket)
    return ticket

@router.delete("/{ticket_id}", status_code=204)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()

@router.post("/{ticket_id}/messages", response_model=MessageOut, status_code=201)
def add_message(ticket_id: int, data: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    msg = Message(
        ticket_id=ticket_id,
        author_id=current_user.id,
        content=data.content,
        is_customer=data.is_customer,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
