"""Ticket models."""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.sql import func
from app.core.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String(100), unique=True, nullable=True)
    subject = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    subcategory = Column(String(100), nullable=True)
    priority = Column(String(50), default="medium")
    status = Column(String(50), default="open")
    customer_email = Column(String(255), nullable=True)
    sentiment_score = Column(Float, nullable=True)
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    resolution = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    resolved_at = Column(DateTime, nullable=True)


class TicketCreate(BaseModel):
    subject: str
    description: str
    customer_email: Optional[str] = None
    priority: str = "medium"
    tags: List[str] = []


class TicketResponse(BaseModel):
    id: int
    subject: str
    description: str
    category: Optional[str] = None
    priority: str
    status: str
    sentiment_score: Optional[float] = None
    tags: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True


class TicketAnalysis(BaseModel):
    ticket_id: int
    category: str
    subcategory: Optional[str] = None
    sentiment_score: float
    priority_suggestion: str
    similar_tickets: List[int] = []
    suggested_resolution: Optional[str] = None
    knowledge_gaps: List[str] = []