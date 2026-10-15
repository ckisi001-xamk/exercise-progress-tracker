import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, DateTime, Text, Integer, ForeignKey, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("workout_plans.id", ondelete="SET NULL"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    session_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="planned", nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    intensity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    source_session_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("workout_sessions.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    plan: Mapped[Optional["WorkoutPlan"]] = relationship("WorkoutPlan", back_populates="sessions")
    items: Mapped[List["WorkoutSessionItem"]] = relationship(
        "WorkoutSessionItem",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="WorkoutSessionItem.sort_order",
    )

    __table_args__ = (
        CheckConstraint("status IN ('planned', 'in_progress', 'completed')", name="ck_workout_sessions_status"),
        CheckConstraint("intensity IS NULL OR (intensity >= 1 AND intensity <= 10)", name="ck_workout_sessions_intensity"),
        Index("ix_workout_sessions_user_session_at", "user_id", "session_at"),
        Index("ix_workout_sessions_plan_session_at", "plan_id", "session_at"),
    )
