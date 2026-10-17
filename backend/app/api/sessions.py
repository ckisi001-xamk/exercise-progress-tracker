from datetime import datetime
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.session import WorkoutSessionCreate, WorkoutSessionRead, WorkoutSessionUpdate, SessionClone
from app.services.sessions import SessionService

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.post("", response_model=WorkoutSessionRead, status_code=status.HTTP_201_CREATED)
def create_session(
    data: WorkoutSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SessionService(db)
    return service.create_session(data, current_user.id)

@router.get("", response_model=List[WorkoutSessionRead])
def list_sessions(
    status: Optional[str] = None,
    plan_id: Optional[uuid.UUID] = None,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    unscheduled: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = SessionService(db)
    return service.list_sessions(
        user_id=current_user.id,
        status=status,
        plan_id=plan_id,
        from_date=from_date,
        to_date=to_date,
        unscheduled=unscheduled
    )

@router.get("/{session_id}", response_model=WorkoutSessionRead)
def get_session(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SessionService(db)
    return service.get_session(session_id, current_user.id)

@router.patch("/{session_id}", response_model=WorkoutSessionRead)
def update_session(
    session_id: uuid.UUID,
    data: WorkoutSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SessionService(db)
    return service.update_session(session_id, data, current_user.id)

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SessionService(db)
    service.delete_session(session_id, current_user.id)

@router.post("/{session_id}/duplicate", response_model=WorkoutSessionRead, status_code=status.HTTP_201_CREATED)
def duplicate_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = SessionService(db)
    return service.duplicate_session(session_id=session_id, user_id=current_user.id)

@router.post("/{session_id}/clone", response_model=WorkoutSessionRead, status_code=status.HTTP_201_CREATED)
def clone_session_endpoint(
    session_id: uuid.UUID,
    data: Optional[SessionClone] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = SessionService(db)
    return service.clone_session(session_id=session_id, user_id=current_user.id, data=data)
