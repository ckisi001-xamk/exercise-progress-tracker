import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import String, DateTime, Numeric, Boolean, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class Goal(Base):
    """
    Period goal model (weekly/monthly target for a unit, optionally tied to an activity).
    Distinct from planned values on individual workout session measurements.
    """
    __tablename__ = "goals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    unit_type_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("unit_types.id", ondelete="RESTRICT"), nullable=False, index=True)
    activity_type_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("activity_types.id", ondelete="SET NULL"), nullable=True, index=True)
    target_value: Mapped[Decimal] = mapped_column(Numeric(12, 3), nullable=False)
    period: Mapped[str] = mapped_column(String(20), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint("period IN ('week', 'month')", name="ck_goals_period"),
    )
