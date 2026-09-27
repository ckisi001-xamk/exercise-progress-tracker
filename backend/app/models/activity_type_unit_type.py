import uuid
from sqlalchemy import Integer, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class ActivityTypeUnitType(Base):
    __tablename__ = "activity_type_unit_types"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    activity_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("activity_types.id", ondelete="CASCADE"), 
        nullable=False
    )
    unit_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("unit_types.id", ondelete="CASCADE"), 
        nullable=False
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    per_set: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint("activity_type_id", "unit_type_id", name="uq_activity_unit"),
    )

    activity_type = relationship("ActivityType", back_populates="unit_links")
    unit_type = relationship("UnitType", back_populates="activity_links")

    def __repr__(self) -> str:
        return f"<ActivityTypeUnitType activity={self.activity_type_id} unit={self.unit_type_id}>"
