import uuid
from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate
from app.repositories.goal import GoalRepository

class GoalService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = GoalRepository(db)

    def create_goal(self, data: GoalCreate, user_id: uuid.UUID) -> Goal:
        goal = Goal(
            user_id=user_id,
            unit_type_id=data.unit_type_id,
            activity_type_id=data.activity_type_id,
            target_value=data.target_value,
            period=data.period,
            active=data.active
        )
        return self.repo.create(goal)

    def get_goal(self, goal_id: uuid.UUID, user_id: uuid.UUID) -> Goal:
        goal = self.repo.get_by_id_and_user(goal_id, user_id)
        if not goal:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
        return goal

    def list_goals(self, user_id: uuid.UUID) -> List[Goal]:
        return self.repo.list_for_user(user_id)

    def update_goal(self, goal_id: uuid.UUID, data: GoalUpdate, user_id: uuid.UUID) -> Goal:
        goal = self.get_goal(goal_id, user_id)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(goal, key, value)
        return self.repo.update(goal)

    def delete_goal(self, goal_id: uuid.UUID, user_id: uuid.UUID) -> None:
        goal = self.get_goal(goal_id, user_id)
        self.repo.delete(goal)
