import uuid
from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.workout_plan import WorkoutPlan
from app.models.workout_session import WorkoutSession
from app.schemas.workout_plan import WorkoutPlanCreate, WorkoutPlanUpdate
from app.repositories.workout_plan import WorkoutPlanRepository

class WorkoutPlanService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = WorkoutPlanRepository(db)

    def create_plan(self, data: WorkoutPlanCreate, user_id: uuid.UUID) -> WorkoutPlan:
        plan = WorkoutPlan(
            user_id=user_id,
            name=data.name,
            notes=data.notes,
            start_date=data.start_date,
            length_weeks=data.length_weeks
        )
        return self.repo.create(plan)

    def get_plan(self, plan_id: uuid.UUID, user_id: uuid.UUID) -> WorkoutPlan:
        plan = self.repo.get_by_id_and_user(plan_id, user_id)
        if not plan:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout plan not found")
        return plan

    def list_plans(self, user_id: uuid.UUID) -> List[WorkoutPlan]:
        return self.repo.list_for_user(user_id)

    def update_plan(self, plan_id: uuid.UUID, data: WorkoutPlanUpdate, user_id: uuid.UUID) -> WorkoutPlan:
        plan = self.get_plan(plan_id, user_id)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(plan, key, value)
        return self.repo.update(plan)

    def delete_plan(self, plan_id: uuid.UUID, user_id: uuid.UUID) -> None:
        plan = self.get_plan(plan_id, user_id)
        self.repo.delete(plan)

    def attach_session(self, plan_id: uuid.UUID, session_id: uuid.UUID, user_id: uuid.UUID) -> WorkoutPlan:
        plan = self.get_plan(plan_id, user_id)
        
        session = self.db.query(WorkoutSession).filter(
            WorkoutSession.id == session_id,
            WorkoutSession.user_id == user_id
        ).first()
        if not session:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
            
        session.plan_id = plan.id
        self.db.commit()
        self.db.refresh(plan)
        return plan
