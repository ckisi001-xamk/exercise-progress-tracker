import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, and_

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.workout_session import WorkoutSession
from app.schemas.calendar import CalendarSessionRead

router = APIRouter(prefix="/calendar", tags=["calendar"])

@router.get("", response_model=List[CalendarSessionRead])
def get_calendar_sessions(
    from_date: datetime = Query(..., alias="from", description="Alkuajankohta ISO-muodossa"),
    to_date: datetime = Query(..., alias="to", description="Loppuajankohta ISO-muodossa"),
    plan_id: Optional[uuid.UUID] = Query(None, description="Valinnainen treeniohjelmarajaus"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filters = [
        WorkoutSession.user_id == current_user.id,
        WorkoutSession.session_at >= from_date,
        WorkoutSession.session_at <= to_date,
    ]

    if plan_id is not None:
        filters.append(WorkoutSession.plan_id == plan_id)

    stmt = (
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.items))
        .where(and_(*filters))
        .order_by(WorkoutSession.session_at.asc())
    )

    sessions = db.execute(stmt).scalars().all()
    return sessions
