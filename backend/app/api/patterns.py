"""Pattern endpoints."""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_session
from app.models.pattern import Pattern, PatternResponse
from app.agents.pattern_detector import PatternDetectorAgent
from app.models.ticket import Ticket

router = APIRouter()


@router.get("", response_model=List[PatternResponse])
async def list_patterns(
    skip: int = 0,
    limit: int = 50,
    session: AsyncSession = Depends(get_session),
):
    query = select(Pattern).order_by(Pattern.ticket_count.desc()).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()


@router.post("/detect")
async def detect_patterns(session: AsyncSession = Depends(get_session)):
    # Get recent tickets
    result = await session.execute(
        select(Ticket).order_by(Ticket.created_at.desc()).limit(500)
    )
    tickets = result.scalars().all()

    if not tickets:
        return {"message": "No tickets to analyze", "patterns_found": 0}

    detector = PatternDetectorAgent()
    patterns = await detector.detect(tickets)

    # Store patterns
    for pattern_data in patterns:
        pattern = Pattern(**pattern_data)
        session.add(pattern)

    await session.commit()

    return {"message": "Pattern detection complete", "patterns_found": len(patterns)}