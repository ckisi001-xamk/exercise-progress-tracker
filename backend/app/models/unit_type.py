import uuid
from sqlalchemy import String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.activity_type_unit_type import ActivityTypeUnitType

class UnitType(Base):
    __tablename__ = "unit_types"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    unit_label: Mapped[str | None] = mapped_column(String(20), nullable=True)
    is_system: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    activity_links: Mapped[List["ActivityTypeUnitType"]] = relationship(
        "ActivityTypeUnitType", 
        back_populates="unit_type", 
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<UnitType {self.slug}>"

    def __str__(self) -> str:
        return f"{self.name} ({self.unit_label})" if self.unit_label else self.name
