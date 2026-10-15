from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.progress import WeeklyProgressSummaryRead
from app.services.progress import ProgressService

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/weekly", response_model=WeeklyProgressSummaryRead)
def get_weekly_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ProgressService(db)
    return service.get_weekly_progress(current_user.id)
