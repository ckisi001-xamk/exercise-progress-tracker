from typing import List
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from app.models.activity_type import ActivityType
from app.models.activity_type_unit_type import ActivityTypeUnitType

class ActivityTypeService:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> List[ActivityType]:
        stmt = (
            select(ActivityType)
            .options(
                selectinload(ActivityType.unit_links).selectinload(ActivityTypeUnitType.unit_type)
            )
            .order_by(ActivityType.name.asc())
        )
        return list(self.db.execute(stmt).scalars().all())
