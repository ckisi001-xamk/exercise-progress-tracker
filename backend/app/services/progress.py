import uuid
from datetime import datetime, timezone, timedelta, time
from decimal import Decimal
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from app.models.goal import Goal
from app.models.workout_session import WorkoutSession
from app.models.workout_session_item import WorkoutSessionItem
from app.models.workout_session_measurement import WorkoutSessionMeasurement
from app.schemas.progress import WeeklyGoalProgressRead, WeeklyProgressSummaryRead

class ProgressService:
    def __init__(self, db: Session):
        self.db = db

    def get_weekly_progress(self, user_id: uuid.UUID, target_date: Optional[datetime] = None) -> WeeklyProgressSummaryRead:
        now = target_date or datetime.now(timezone.utc)
        start_of_week = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_week = start_of_week + timedelta(days=7)

        # 1. Haetaan käyttäjän aktiiviset viikkotavoitteet
        goals_stmt = (
            select(Goal)
            .where(
                Goal.user_id == user_id,
                Goal.period == "week",
                Goal.active.is_(True)
            )
        )
        goals = list(self.db.execute(goals_stmt).scalars().all())

        progress_items: List[WeeklyGoalProgressRead] = []

        # 2. Lasketaan toteumat
        for goal in goals:
            filters = [
                WorkoutSession.user_id == user_id,
                WorkoutSession.session_at >= start_of_week,
                WorkoutSession.session_at < end_of_week,
                WorkoutSessionMeasurement.unit_type_id == goal.unit_type_id,
                WorkoutSessionMeasurement.actual_value.is_not(None)
            ]

            if goal.activity_type_id is not None:
                filters.append(WorkoutSessionItem.activity_type_id == goal.activity_type_id)

            sum_stmt = (
                select(func.coalesce(func.sum(WorkoutSessionMeasurement.actual_value), 0))
                .select_from(WorkoutSessionMeasurement)
                .join(WorkoutSessionItem, WorkoutSessionMeasurement.session_item_id == WorkoutSessionItem.id)
                .join(WorkoutSession, WorkoutSessionItem.session_id == WorkoutSession.id)
                .where(and_(*filters))
            )
            actual_sum: Decimal = self.db.execute(sum_stmt).scalar() or Decimal(0)

            pct = 0.0
            if goal.target_value > 0:
                pct = round(float((actual_sum / goal.target_value) * 100), 1)

            progress_items.append(
                WeeklyGoalProgressRead(
                    goal_id=goal.id,
                    unit_type_id=goal.unit_type_id,
                    activity_type_id=goal.activity_type_id,
                    target_value=goal.target_value,
                    actual_value=actual_sum,
                    progress_pct=pct,
                    week_start=start_of_week.date(),
                    week_end=(end_of_week - timedelta(days=1)).date()
                )
            )

        return WeeklyProgressSummaryRead(
            items=progress_items,
            week_start=start_of_week.date(),
            week_end=(end_of_week - timedelta(days=1)).date()
        )
