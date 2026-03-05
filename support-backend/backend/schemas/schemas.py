from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models.user import UserRole
from models.ticket import TicketStatus, TicketPriority

# ─── AUTH ─────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.agent

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime
    class Config: from_attributes = True

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class LoginIn(BaseModel):
    email: EmailStr
    password: str

# ─── TICKETS ──────────────────────────────────────────────────────────────────
class TicketCreate(BaseModel):
    subject: str
    description: Optional[str] = None
    customer_name: str
    customer_email: EmailStr
    priority: TicketPriority = TicketPriority.normal
    category: str = "General"

class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    assigned_to: Optional[int] = None
    category: Optional[str] = None

class MessageOut(BaseModel):
    id: int
    content: str
    is_customer: bool
    is_ai_generated: bool
    created_at: datetime
    author: Optional[UserOut] = None
    class Config: from_attributes = True

class TicketOut(BaseModel):
    id: int
    ticket_number: str
    subject: str
    description: Optional[str]
    customer_name: str
    customer_email: str
    status: TicketStatus
    priority: TicketPriority
    category: str
    assigned_to: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    messages: List[MessageOut] = []
    assigned_agent: Optional[UserOut] = None
    class Config: from_attributes = True

class TicketListOut(BaseModel):
    id: int
    ticket_number: str
    subject: str
    customer_name: str
    customer_email: str
    status: TicketStatus
    priority: TicketPriority
    category: str
    assigned_to: Optional[int]
    created_at: datetime
    message_count: int = 0
    class Config: from_attributes = True

# ─── MESSAGES ─────────────────────────────────────────────────────────────────
class MessageCreate(BaseModel):
    content: str
    is_customer: bool = False

# ─── KB ───────────────────────────────────────────────────────────────────────
class KBArticleCreate(BaseModel):
    title: str
    content: str
    category: str = "General"

class KBArticleOut(BaseModel):
    id: int
    title: str
    content: str
    category: str
    views: int
    is_published: bool
    created_at: datetime
    class Config: from_attributes = True

# ─── AI ───────────────────────────────────────────────────────────────────────
class AIRequest(BaseModel):
    prompt: str
    tone: str = "professional"
    template: str = "reply"

class AIResponse(BaseModel):
    result: str

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    session_id: Optional[str] = None

# ─── ANALYTICS ────────────────────────────────────────────────────────────────
class AnalyticsOut(BaseModel):
    total_tickets: int
    open_tickets: int
    pending_tickets: int
    closed_tickets: int
    resolved_today: int
    avg_response_time: str
    ai_suggestions_used: int
    category_breakdown: List[dict]
    weekly_trend: List[int]
