from typing import Dict, List, Literal, Optional
from pydantic import BaseModel


class ActivitySummary(BaseModel):
    session_count: int
    duration_min: float
    distance_km: float


class SummaryResponse(BaseModel):
    session_count: int
    total_duration_min: float
    total_distance_km: float
    avg_intensity: Optional[float] = None
    by_activity: Dict[str, ActivitySummary]


class ProgressPoint(BaseModel):
    period_label: str
    value: float


class ProgressResponse(BaseModel):
    metric: str
    granularity: str
    series: List[ProgressPoint]


class StreakResponse(BaseModel):
    current: int
    longest: int
