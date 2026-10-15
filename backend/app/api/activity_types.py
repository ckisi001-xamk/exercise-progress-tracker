from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.activity_type import ActivityTypeRead
from app.services.activity_types import ActivityTypeService

router = APIRouter(prefix="/activity-types", tags=["activity-types"])

@router.get("", response_model=List[ActivityTypeRead])
def list_activity_types(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ActivityTypeService(db)
    return service.list_all()
