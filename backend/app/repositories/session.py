from datetime import datetime
import uuid
from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.orm import Session, selectinload
from app.models.workout_session import WorkoutSession
from app.models.workout_session_item import WorkoutSessionItem

class SessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id_for_user(self, session_id: uuid.UUID, user_id: uuid.UUID) -> Optional[WorkoutSession]:
        stmt = (
            select(WorkoutSession)
            .where(WorkoutSession.id == session_id, WorkoutSession.user_id == user_id)
            .options(
                selectinload(WorkoutSession.items).selectinload(WorkoutSessionItem.measurements)
            )
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def list_for_user(
        self,
        user_id: uuid.UUID,
        status: Optional[str] = None,
        plan_id: Optional[uuid.UUID] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
        unscheduled: Optional[bool] = None
    ) -> List[WorkoutSession]:
        stmt = (
            select(WorkoutSession)
            .where(WorkoutSession.user_id == user_id)
            .options(
                selectinload(WorkoutSession.items).selectinload(WorkoutSessionItem.measurements)
            )
        )
        if status:
            stmt = stmt.where(WorkoutSession.status == status)
        if plan_id:
            stmt = stmt.where(WorkoutSession.plan_id == plan_id)
        if from_date:
            stmt = stmt.where(WorkoutSession.session_at >= from_date)
        if to_date:
            stmt = stmt.where(WorkoutSession.session_at <= to_date)
        if unscheduled is True:
            stmt = stmt.where(WorkoutSession.session_at.is_(None))
        elif unscheduled is False:
            stmt = stmt.where(WorkoutSession.session_at.is_not(None))

        stmt = stmt.order_by(desc(WorkoutSession.created_at))
        return list(self.db.execute(stmt).scalars().all())

    def create(self, session: WorkoutSession) -> WorkoutSession:
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def delete(self, session: WorkoutSession) -> None:
        self.db.delete(session)
        self.db.commit()
