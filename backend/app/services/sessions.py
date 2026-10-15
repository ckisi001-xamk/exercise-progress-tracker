from datetime import datetime, timezone
import uuid
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.workout_session import WorkoutSession
from app.models.workout_session_item import WorkoutSessionItem
from app.models.workout_session_measurement import WorkoutSessionMeasurement
from app.models.workout_plan import WorkoutPlan
from app.models.activity_type import ActivityType
from app.models.activity_type_unit_type import ActivityTypeUnitType
from app.repositories.session import SessionRepository
from app.schemas.session import WorkoutSessionCreate, WorkoutSessionUpdate

class SessionService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = SessionRepository(db)

    def _verify_plan_ownership(self, plan_id: Optional[uuid.UUID], user_id: uuid.UUID):
        if not plan_id:
            return
        stmt = select(WorkoutPlan).where(WorkoutPlan.id == plan_id, WorkoutPlan.user_id == user_id)
        plan = self.db.execute(stmt).scalar_one_or_none()
        if not plan:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")

    def _build_items(self, items_data) -> List[WorkoutSessionItem]:
        built_items = []
        for item_data in items_data:
            # 1. Tarkista activity_type
            stmt = select(ActivityType).where(ActivityType.id == item_data.activity_type_id)
            activity = self.db.execute(stmt).scalar_one_or_none()
            if not activity:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Activity type not found")

            # 2. Hae aktiviteetin sallitut yksiköt
            stmt_links = select(ActivityTypeUnitType).where(ActivityTypeUnitType.activity_type_id == item_data.activity_type_id)
            links = {link.unit_type_id: link for link in self.db.execute(stmt_links).scalars().all()}

            session_item = WorkoutSessionItem(
                activity_type_id=item_data.activity_type_id,
                sort_order=item_data.sort_order,
                notes=item_data.notes
            )

            # 3. Mittausten validointi (S3-05)
            for m_data in item_data.measurements:
                if m_data.unit_type_id not in links:
                    raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Unit is not allowed for this activity")
                
                link = links[m_data.unit_type_id]
                if link.per_set and m_data.set_index is None:
                    raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="set_index is required for per-set units")

                measurement = WorkoutSessionMeasurement(
                    unit_type_id=m_data.unit_type_id,
                    planned_value=m_data.planned_value,
                    actual_value=m_data.actual_value,
                    set_index=m_data.set_index
                )
                session_item.measurements.append(measurement)

            built_items.append(session_item)
        return built_items

    def create_session(self, data: WorkoutSessionCreate, user_id: uuid.UUID) -> WorkoutSession:
        self._verify_plan_ownership(data.plan_id, user_id)
        
        session = WorkoutSession(
            user_id=user_id,
            name=data.name,
            session_at=data.session_at,
            status=data.status,
            notes=data.notes,
            intensity=data.intensity,
            plan_id=data.plan_id
        )
        session.items = self._build_items(data.items)
        return self.repo.create(session)

    def get_session(self, session_id: uuid.UUID, user_id: uuid.UUID) -> WorkoutSession:
        session = self.repo.get_by_id_for_user(session_id, user_id)
        if not session:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        return session

    def list_sessions(self, user_id: uuid.UUID) -> List[WorkoutSession]:
        return self.repo.list_for_user(user_id)

    def update_session(self, session_id: uuid.UUID, data: WorkoutSessionUpdate, user_id: uuid.UUID) -> WorkoutSession:
        session = self.get_session(session_id, user_id)
        
        if data.plan_id is not None:
            self._verify_plan_ownership(data.plan_id, user_id)
            session.plan_id = data.plan_id

        update_dict = data.model_dump(exclude_unset=True, exclude={"items", "plan_id"})
        for key, value in update_dict.items():
            setattr(session, key, value)

        if data.items is not None:
            session.items.clear()
            self.db.flush()
            session.items = self._build_items(data.items)

        self.db.commit()
        self.db.refresh(session)
        return session

    def delete_session(self, session_id: uuid.UUID, user_id: uuid.UUID) -> None:
        session = self.get_session(session_id, user_id)
        self.repo.delete(session)

    def duplicate_session(self, session_id: uuid.UUID, user_id: uuid.UUID) -> WorkoutSession:
        original = self.repo.get_by_id_for_user(session_id, user_id)
        if not original:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

        # SACM-audit trail: source_session_id kytketään alkuperäiseen ja tila nollataan
        new_session = WorkoutSession(
            user_id=user_id,
            name=f"{original.name} (Kopio)",
            status="planned",
            notes=original.notes,
            intensity=None,
            plan_id=original.plan_id,
            source_session_id=original.id,
            session_at=datetime.now(timezone.utc)
        )

        for orig_item in original.items:
            new_item = WorkoutSessionItem(
                activity_type_id=orig_item.activity_type_id,
                sort_order=orig_item.sort_order,
                notes=orig_item.notes
            )
            for orig_m in orig_item.measurements:
                new_m = WorkoutSessionMeasurement(
                    unit_type_id=orig_m.unit_type_id,
                    planned_value=orig_m.actual_value if orig_m.actual_value is not None else orig_m.planned_value,
                    actual_value=None,
                    set_index=orig_m.set_index
                )
                new_item.measurements.append(new_m)
            new_session.items.append(new_item)

        return self.repo.create(new_session)
