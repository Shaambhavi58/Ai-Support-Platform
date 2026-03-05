from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null = customer
    content = Column(Text, nullable=False)
    is_customer = Column(Boolean, default=False)  # True = sent by customer
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    ticket = relationship("Ticket", back_populates="messages")
    author = relationship("User", back_populates="messages")


class KBArticle(Base):
    __tablename__ = "kb_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, default="General")
    views = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    visitor_name = Column(String, nullable=True)
    visitor_email = Column(String, nullable=True)
    page_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    sentiment = Column(String, default="neutral")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    messages = Column(Text, default="[]")  # JSON string of chat history
