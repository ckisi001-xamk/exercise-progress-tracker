import uuid
from decimal import Decimal
from typing import Optional
from sqlalchemy import Integer, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class WorkoutSessionMeasurement(Base):
    __tablename__ = "workout_session_measurements"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_item_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workout_session_items.id", ondelete="CASCADE"), nullable=False, index=True)
    unit_type_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("unit_types.id", ondelete="RESTRICT"), nullable=False, index=True)
    planned_value: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 3), nullable=True)
    actual_value: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 3), nullable=True)
    set_index: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    item: Mapped["WorkoutSessionItem"] = relationship("WorkoutSessionItem", back_populates="measurements")
