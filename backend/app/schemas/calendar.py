import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class CalendarSessionItemRead(BaseModel):
    id: uuid.UUID
    activity_type_id: uuid.UUID
    sort_order: int
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class CalendarSessionRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    plan_id: Optional[uuid.UUID] = None
    name: Optional[str] = None
    session_at: datetime
    status: str
    intensity: Optional[int] = None
    notes: Optional[str] = None
    items: List[CalendarSessionItemRead] = []

    model_config = ConfigDict(from_attributes=True)
