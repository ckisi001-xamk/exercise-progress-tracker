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


@dataclass(frozen=True)
class SessionInput:
    id: str
    session_at: Optional[datetime]
    activity_type_id: Optional[str] = None
    activity_type_name: Optional[str] = None
    intensity: Optional[int] = None
    status: Optional[str] = None
    measurements: List[MeasurementInput] = field(default_factory=list)


def ping_analytics() -> str:
    return "analytics_ready"
