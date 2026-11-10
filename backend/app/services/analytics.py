"""
Pure analytics engine.
No FastAPI, no SQLAlchemy, no direct DB/IO access.
All inputs must be scoped to the authenticated user before passing into this module.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional


@dataclass(frozen=True)
class MeasurementInput:
    unit_slug: str
    actual_value: Optional[float] = None
    planned_value: Optional[float] = None

    @property
    def value(self) -> float:
        if self.actual_value is not None:
            return float(self.actual_value)
        if self.planned_value is not None:
            return float(self.planned_value)
        return 0.0


@dataclass(frozen=True)
class SessionInput:
    id: str
    session_at: Optional[datetime]
    activity_type_id: Optional[str] = None
    activity_type_name: Optional[str] = None
    intensity: Optional[int] = None
    status: Optional[str] = None
    measurements: List[MeasurementInput] = field(default_factory=list)


def compute_summary(sessions: List[SessionInput]) -> Dict[str, Any]:
    """
    Computes period summary metrics over a pre-filtered list of sessions.
    Unscheduled sessions (session_at is None) are excluded from period counts.
    Empty input returns zero totals and empty breakdowns safely.
    Average intensity is 0.0 if no sessions have intensity defined.
    """
    valid_sessions = [s for s in sessions if s.session_at is not None]

    if not valid_sessions:
        return {
            "session_count": 0,
            "total_duration_min": 0.0,
            "total_distance_km": 0.0,
            "avg_intensity": 0.0,
            "by_activity": {},
        }

    total_duration = 0.0
    total_distance = 0.0
    intensity_sum = 0
    intensity_count = 0
    by_activity: Dict[str, Dict[str, Any]] = {}

    for s in valid_sessions:
        act_name = s.activity_type_name or "Muu"
        if act_name not in by_activity:
            by_activity[act_name] = {
                "session_count": 0,
                "duration_min": 0.0,
                "distance_km": 0.0,
            }
        by_activity[act_name]["session_count"] += 1

        if s.intensity is not None:
            intensity_sum += s.intensity
            intensity_count += 1

        for m in s.measurements:
            val = m.value
            if m.unit_slug in ("duration_min", "duration"):
                total_duration += val
                by_activity[act_name]["duration_min"] += val
            elif m.unit_slug in ("distance_km", "distance"):
                total_distance += val
                by_activity[act_name]["distance_km"] += val

    avg_intensity = round(intensity_sum / intensity_count, 1) if intensity_count > 0 else 0.0

    return {
        "session_count": len(valid_sessions),
        "total_duration_min": round(total_duration, 1),
        "total_distance_km": round(total_distance, 2),
        "avg_intensity": avg_intensity,
        "by_activity": by_activity,
    }
