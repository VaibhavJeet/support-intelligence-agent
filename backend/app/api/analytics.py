"""Analytics endpoints."""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_session
from app.models.ticket import Ticket
from app.models.pattern import Pattern
from app.agents.knowledge_gap_detector import KnowledgeGapDetector

router = APIRouter()


@router.get("/trends")
async def get_trends(session: AsyncSession = Depends(get_session)) -> Dict[str, Any]:
    # Get ticket counts by date
    result = await session.execute(
        select(
            func.date(Ticket.created_at).label("date"),
            func.count(Ticket.id).label("count")
        ).group_by(func.date(Ticket.created_at)).order_by(func.date(Ticket.created_at).desc()).limit(30)
    )
    daily_counts = [{"date": str(row.date), "count": row.count} for row in result]

    return {"daily_tickets": daily_counts}


@router.get("/categories")
async def get_category_distribution(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(
            Ticket.category,
            func.count(Ticket.id).label("count")
        ).where(Ticket.category.isnot(None)).group_by(Ticket.category)
    )
    return [{"category": row.category or "Uncategorized", "count": row.count} for row in result]


@router.get("/knowledge-gaps")
async def get_knowledge_gaps(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Ticket).where(Ticket.category.isnot(None)).limit(200)
    )
    tickets = result.scalars().all()

    if not tickets:
        return {"gaps": [], "suggested_faqs": []}

    detector = KnowledgeGapDetector()
    gaps = await detector.detect(tickets)

    return gaps


@router.get("/summary")
async def get_summary(session: AsyncSession = Depends(get_session)):
    total = await session.execute(select(func.count(Ticket.id)))
    open_count = await session.execute(
        select(func.count(Ticket.id)).where(Ticket.status == "open")
    )
    pattern_count = await session.execute(select(func.count(Pattern.id)))

    return {
        "total_tickets": total.scalar() or 0,
        "open_tickets": open_count.scalar() or 0,
        "patterns_detected": pattern_count.scalar() or 0,
    }