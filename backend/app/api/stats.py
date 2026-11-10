from datetime import datetime
from typing import Literal, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.stats import ProgressResponse, SummaryResponse
from app.services import stats as stats_service

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary", response_model=SummaryResponse)
def get_summary(
    date_from: Optional[datetime] = Query(None, alias="from"),
    date_to: Optional[datetime] = Query(None, alias="to"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return stats_service.get_user_summary(
        db=db,
        user_id=str(current_user.id),
        date_from=date_from,
        date_to=date_to,
    )


@router.get("/progress", response_model=ProgressResponse)
def get_progress(
    metric: Literal["sessions", "duration_min", "distance_km"] = Query("sessions"),
    granularity: Literal["week", "month"] = Query("week"),
    activity_type_id: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None, alias="from"),
    date_to: Optional[datetime] = Query(None, alias="to"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return stats_service.get_user_progress(
        db=db,
        user_id=str(current_user.id),
        metric=metric,
        granularity=granularity,
        activity_type_id=activity_type_id,
        date_from=date_from,
        date_to=date_to,
    )
