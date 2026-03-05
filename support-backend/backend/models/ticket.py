from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base
import enum

class TicketStatus(str, enum.Enum):
    open = "open"
    pending = "pending"
    closed = "closed"

class TicketPriority(str, enum.Enum):
    low = "low"
    normal = "normal"
    high = "high"
    urgent = "urgent"

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_number = Column(String, unique=True, index=True)  # e.g. TKT-001
    subject = Column(String, nullable=False)
    description = Column(Text)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.open)
    priority = Column(Enum(TicketPriority), default=TicketPriority.normal)
    category = Column(String, default="General")
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    closed_at = Column(DateTime(timezone=True), nullable=True)

    assigned_agent = relationship("User", back_populates="tickets_assigned", foreign_keys=[assigned_to])
    created_by_user = relationship("User", back_populates="tickets_created", foreign_keys=[created_by])
    messages = relationship("Message", back_populates="ticket", cascade="all, delete-orphan")
