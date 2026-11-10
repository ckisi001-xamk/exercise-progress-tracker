from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel


class ActivitySummary(BaseModel):
    session_count: int
    duration_min: float
    distance_km: float


class SummaryResponse(BaseModel):
    session_count: int
    total_duration_min: float
    total_distance_km: float
    avg_intensity: float
    by_activity: Dict[str, ActivitySummary]
