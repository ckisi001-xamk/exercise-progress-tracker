import uuid
from sqlalchemy import String, Boolean, UniqueConstraint, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.activity_type_unit_type import ActivityTypeUnitType

class ActivityType(Base):
    __tablename__ = "activity_types"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    is_system: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=True
    )

    __table_args__ = (
        UniqueConstraint("user_id", "slug", name="uq_activity_types_user_slug"),
    )

    unit_links: Mapped[List["ActivityTypeUnitType"]] = relationship(
        "ActivityTypeUnitType", 
        back_populates="activity_type", 
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<ActivityType {self.slug}>"

    def __str__(self) -> str:
        return self.name
