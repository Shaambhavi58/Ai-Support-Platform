from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    agent = "agent"
    viewer = "viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.agent)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tickets_assigned = relationship("Ticket", back_populates="assigned_agent", foreign_keys="Ticket.assigned_to")
    tickets_created = relationship("Ticket", back_populates="created_by_user", foreign_keys="Ticket.created_by")
    messages = relationship("Message", back_populates="author")
