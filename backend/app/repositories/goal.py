import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from app.models.goal import Goal

class GoalRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, goal: Goal) -> Goal:
        self.db.add(goal)
        self.db.commit()
        self.db.refresh(goal)
        return goal

    def get_by_id_and_user(self, goal_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Goal]:
        stmt = select(Goal).where(Goal.id == goal_id, Goal.user_id == user_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def list_for_user(self, user_id: uuid.UUID) -> List[Goal]:
        stmt = select(Goal).where(Goal.user_id == user_id).order_by(desc(Goal.created_at))
        return list(self.db.execute(stmt).scalars().all())

    def update(self, goal: Goal) -> Goal:
        self.db.commit()
        self.db.refresh(goal)
        return goal

    def delete(self, goal: Goal) -> None:
        self.db.delete(goal)
        self.db.commit()
