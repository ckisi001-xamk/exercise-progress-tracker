import uuid
from decimal import Decimal
from typing import Optional, List
from datetime import date
from pydantic import BaseModel, ConfigDict

class WeeklyGoalProgressRead(BaseModel):
    goal_id: uuid.UUID
    unit_type_id: uuid.UUID
    activity_type_id: Optional[uuid.UUID] = None
    target_value: Decimal
    actual_value: Decimal
    progress_pct: float
    week_start: date
    week_end: date

    model_config = ConfigDict(from_attributes=True)

class WeeklyProgressSummaryRead(BaseModel):
    items: List[WeeklyGoalProgressRead]
    week_start: date
    week_end: date
