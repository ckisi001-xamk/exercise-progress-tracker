import uuid
from typing import Optional, List
from sqlalchemy import Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class WorkoutSessionItem(Base):
    __tablename__ = "workout_session_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workout_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_type_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("activity_types.id", ondelete="RESTRICT"), nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    session: Mapped["WorkoutSession"] = relationship("WorkoutSession", back_populates="items")
    measurements: Mapped[List["WorkoutSessionMeasurement"]] = relationship(
        "WorkoutSessionMeasurement",
        back_populates="item",
        cascade="all, delete-orphan",
        order_by="WorkoutSessionMeasurement.set_index",
    )
