import uuid
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.session import WorkoutSessionRead

class WorkoutPlanBase(BaseModel):
    name: str
    notes: Optional[str] = None
    start_date: Optional[date] = None
    length_weeks: Optional[int] = None

class WorkoutPlanCreate(WorkoutPlanBase):
    pass

class WorkoutPlanUpdate(BaseModel):
    name: Optional[str] = None
    notes: Optional[str] = None
    start_date: Optional[date] = None
    length_weeks: Optional[int] = None

class WorkoutPlanRead(WorkoutPlanBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    sessions: List[WorkoutSessionRead] = []

    model_config = ConfigDict(from_attributes=True)
