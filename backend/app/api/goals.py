import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalRead, GoalUpdate
from app.services.goal import GoalService

router = APIRouter(prefix="/goals", tags=["goals"])

@router.post("", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(
    data: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = GoalService(db)
    return service.create_goal(data, current_user.id)

@router.get("", response_model=List[GoalRead])
def list_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = GoalService(db)
    return service.list_goals(current_user.id)

@router.get("/{goal_id}", response_model=GoalRead)
def get_goal(
    goal_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = GoalService(db)
    return service.get_goal(goal_id, current_user.id)

@router.put("/{goal_id}", response_model=GoalRead)
def update_goal(
    goal_id: uuid.UUID,
    data: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = GoalService(db)
    return service.update_goal(goal_id, data, current_user.id)

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = GoalService(db)
    service.delete_goal(goal_id, current_user.id)
