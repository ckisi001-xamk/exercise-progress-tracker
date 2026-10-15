import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.workout_plan import WorkoutPlanCreate, WorkoutPlanRead, WorkoutPlanUpdate
from app.services.workout_plan import WorkoutPlanService

router = APIRouter(prefix="/plans", tags=["workout-plans"])

@router.post("", response_model=WorkoutPlanRead, status_code=status.HTTP_201_CREATED)
def create_plan(
    data: WorkoutPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkoutPlanService(db)
    return service.create_plan(data, current_user.id)

@router.get("", response_model=List[WorkoutPlanRead])
def list_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkoutPlanService(db)
    return service.list_plans(current_user.id)

@router.get("/{plan_id}", response_model=WorkoutPlanRead)
def get_plan(
    plan_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkoutPlanService(db)
    return service.get_plan(plan_id, current_user.id)

@router.put("/{plan_id}", response_model=WorkoutPlanRead)
def update_plan(
    plan_id: uuid.UUID,
    data: WorkoutPlanUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkoutPlanService(db)
    return service.update_plan(plan_id, data, current_user.id)

@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plan(
    plan_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkoutPlanService(db)
    service.delete_plan(plan_id, current_user.id)

@router.post("/{plan_id}/sessions/{session_id}", response_model=WorkoutPlanRead)
def attach_session_to_plan(
    plan_id: uuid.UUID,
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkoutPlanService(db)
    return service.attach_session(plan_id, session_id, current_user.id)
