import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, model_validator

# --- Measurements ---
class MeasurementBase(BaseModel):
    unit_type_id: uuid.UUID
    planned_value: Optional[Decimal] = None
    actual_value: Optional[Decimal] = None
    set_index: Optional[int] = Field(default=None, ge=0)

    @model_validator(mode="after")
    def validate_has_value(self):
        if self.planned_value is None and self.actual_value is None:
            raise ValueError("Measurement needs a planned value, an actual value, or both")
        return self

class MeasurementCreate(MeasurementBase):
    pass

class MeasurementRead(MeasurementBase):
    id: uuid.UUID
    session_item_id: uuid.UUID

    class Config:
        from_attributes = True

# --- Items ---
class SessionItemBase(BaseModel):
    activity_type_id: uuid.UUID
    sort_order: int = 0
    notes: Optional[str] = None

class SessionItemCreate(SessionItemBase):
    measurements: List[MeasurementCreate] = []

class SessionItemRead(SessionItemBase):
    id: uuid.UUID
    session_id: uuid.UUID
    measurements: List[MeasurementRead] = []

    class Config:
        from_attributes = True

# --- WorkoutSession ---
class WorkoutSessionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    session_at: Optional[datetime] = None
    status: str = Field(default="planned", pattern="^(planned|in_progress|completed)$")
    notes: Optional[str] = None
    intensity: Optional[int] = Field(default=None, ge=1, le=10)
    plan_id: Optional[uuid.UUID] = None

class WorkoutSessionCreate(WorkoutSessionBase):
    items: List[SessionItemCreate] = []

class WorkoutSessionUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    session_at: Optional[datetime] = None
    status: Optional[str] = Field(default=None, pattern="^(planned|in_progress|completed)$")
    notes: Optional[str] = None
    intensity: Optional[int] = Field(default=None, ge=1, le=10)
    plan_id: Optional[uuid.UUID] = None
    items: Optional[List[SessionItemCreate]] = None

class WorkoutSessionRead(WorkoutSessionBase):
    id: uuid.UUID
    user_id: uuid.UUID
    source_session_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
    items: List[SessionItemRead] = []

    class Config:
        from_attributes = True
