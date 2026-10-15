import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict

class GoalBase(BaseModel):
    unit_type_id: uuid.UUID
    activity_type_id: Optional[uuid.UUID] = None
    target_value: Decimal
    period: Literal["week", "month"]
    active: bool = True

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    unit_type_id: Optional[uuid.UUID] = None
    activity_type_id: Optional[uuid.UUID] = None
    target_value: Optional[Decimal] = None
    period: Optional[Literal["week", "month"]] = None
    active: Optional[bool] = None

class GoalRead(GoalBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
