import uuid
from typing import List, Optional
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, desc
from app.models.workout_plan import WorkoutPlan

class WorkoutPlanRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, plan: WorkoutPlan) -> WorkoutPlan:
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def get_by_id_and_user(self, plan_id: uuid.UUID, user_id: uuid.UUID) -> Optional[WorkoutPlan]:
        stmt = (
            select(WorkoutPlan)
            .where(WorkoutPlan.id == plan_id, WorkoutPlan.user_id == user_id)
            .options(selectinload(WorkoutPlan.sessions))
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def list_for_user(self, user_id: uuid.UUID) -> List[WorkoutPlan]:
        stmt = (
            select(WorkoutPlan)
            .where(WorkoutPlan.user_id == user_id)
            .options(selectinload(WorkoutPlan.sessions))
            .order_by(desc(WorkoutPlan.created_at))
        )
        return list(self.db.execute(stmt).scalars().all())

    def update(self, plan: WorkoutPlan) -> WorkoutPlan:
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def delete(self, plan: WorkoutPlan) -> None:
        self.db.delete(plan)
        self.db.commit()
