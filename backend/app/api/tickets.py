"""Ticket endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_session
from app.models.ticket import Ticket, TicketCreate, TicketResponse, TicketAnalysis
from app.agents.ticket_analyzer import TicketAnalyzerAgent

router = APIRouter()


@router.post("", response_model=TicketResponse)
async def create_ticket(
    ticket: TicketCreate,
    session: AsyncSession = Depends(get_session),
):
    db_ticket = Ticket(**ticket.model_dump())
    session.add(db_ticket)
    await session.commit()
    await session.refresh(db_ticket)
    return db_ticket


@router.get("", response_model=List[TicketResponse])
async def list_tickets(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    category: Optional[str] = None,
    session: AsyncSession = Depends(get_session),
):
    query = select(Ticket)
    if status:
        query = query.where(Ticket.status == status)
    if category:
        query = query.where(Ticket.category == category)
    query = query.offset(skip).limit(limit).order_by(Ticket.created_at.desc())
    result = await session.execute(query)
    return result.scalars().all()


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(ticket_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.post("/{ticket_id}/analyze", response_model=TicketAnalysis)
async def analyze_ticket(ticket_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    analyzer = TicketAnalyzerAgent()
    analysis = await analyzer.analyze(ticket)

    # Update ticket with analysis results
    ticket.category = analysis.category
    ticket.subcategory = analysis.subcategory
    ticket.sentiment_score = analysis.sentiment_score
    await session.commit()

    return analysis