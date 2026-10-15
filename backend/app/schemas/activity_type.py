import uuid
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class UnitTypeRead(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    unit_label: Optional[str] = None
    is_system: bool

    model_config = ConfigDict(from_attributes=True)

class ActivityTypeUnitLinkRead(BaseModel):
    id: uuid.UUID
    unit_type_id: uuid.UUID
    sort_order: int
    is_required: bool
    per_set: bool
    unit_type: UnitTypeRead

    model_config = ConfigDict(from_attributes=True)

class ActivityTypeRead(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    is_system: bool
    user_id: Optional[uuid.UUID] = None
    unit_links: List[ActivityTypeUnitLinkRead] = []

    model_config = ConfigDict(from_attributes=True)
