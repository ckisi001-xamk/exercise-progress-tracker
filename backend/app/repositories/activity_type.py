from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.activity_type import ActivityType
from app.models.activity_type_unit_type import ActivityTypeUnitType

def get_by_slug(db: Session, slug: str) -> ActivityType | None:
    return db.scalar(select(ActivityType).where(ActivityType.slug == slug))

def create(db: Session, name: str, slug: str, is_system: bool = True) -> ActivityType:
    activity = ActivityType(name=name, slug=slug, is_system=is_system)
    db.add(activity)
    db.flush()
    return activity

def link_unit(db: Session, activity_id, unit_id, sort_order: int = 0, is_required: bool = True, per_set: bool = False) -> ActivityTypeUnitType:
    existing = db.scalar(
        select(ActivityTypeUnitType).where(
            ActivityTypeUnitType.activity_type_id == activity_id,
            ActivityTypeUnitType.unit_type_id == unit_id
        )
    )
    if existing:
        return existing
    link = ActivityTypeUnitType(
        activity_type_id=activity_id,
        unit_type_id=unit_id,
        sort_order=sort_order,
        is_required=is_required,
        per_set=per_set
    )
    db.add(link)
    db.flush()
    return link
