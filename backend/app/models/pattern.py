"""Pattern models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.sql import func
from app.core.database import Base


class Pattern(Base):
    __tablename__ = "patterns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    ticket_count = Column(Integer, default=0)
    ticket_ids = Column(JSON, default=list)
    keywords = Column(JSON, default=list)
    trend = Column(String(50), default="stable")  # rising, stable, declining
    severity = Column(String(50), default="medium")
    first_seen = Column(DateTime, server_default=func.now())
    last_seen = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())


class PatternResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    ticket_count: int
    keywords: List[str] = []
    trend: str
    severity: str
    first_seen: datetime
    last_seen: datetime

    class Config:
        from_attributes = True