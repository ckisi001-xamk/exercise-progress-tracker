from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.unit_type import UnitType

def get_by_slug(db: Session, slug: str) -> UnitType | None:
    return db.scalar(select(UnitType).where(UnitType.slug == slug))

def create(db: Session, name: str, slug: str, unit_label: str | None = None, is_system: bool = True) -> UnitType:
    unit = UnitType(name=name, slug=slug, unit_label=unit_label, is_system=is_system)
    db.add(unit)
    db.flush()
    return unit
