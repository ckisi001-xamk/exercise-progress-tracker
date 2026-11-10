from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from sqlalchemy.orm import Session, joinedload

from app.models.workout_session import WorkoutSession
from app.models.workout_session_item import WorkoutSessionItem
from app.models.activity_type import ActivityType
from app.models.unit_type import UnitType
from app.services.analytics import MeasurementInput, SessionInput, compute_summary, compute_progress_series


def _load_user_session_inputs(
    db: Session,
    user_id: str,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
) -> List[SessionInput]:
    unit_map = {str(u.id): u.slug for u in db.query(UnitType).all()}
    act_map = {str(a.id): a.name for a in db.query(ActivityType).all()}

    query = (
        db.query(WorkoutSession)
        .options(
            joinedload(WorkoutSession.items).joinedload(WorkoutSessionItem.measurements)
        )
        .filter(WorkoutSession.user_id == user_id)
    )
    if date_from:
        query = query.filter(WorkoutSession.session_at >= date_from)
    if date_to:
        query = query.filter(WorkoutSession.session_at <= date_to)

    models = query.all()
    inputs = []
    for m in models:
        meas = []
        act_id = None
        act_name = None

        items = getattr(m, "items", []) or []
        if items:
            first_item = items[0]
            if getattr(first_item, "activity_type_id", None):
                act_id = str(first_item.activity_type_id)
                act_name = act_map.get(act_id)

        for item in items:
            for measurement in getattr(item, "measurements", []) or []:
                u_id = str(measurement.unit_type_id) if measurement.unit_type_id else ""
                meas.append(
                    MeasurementInput(
                        unit_slug=unit_map.get(u_id, ""),
                        actual_value=float(measurement.actual_value) if measurement.actual_value is not None else None,
                        planned_value=float(measurement.planned_value) if measurement.planned_value is not None else None,
                    )
                )

        inputs.append(
            SessionInput(
                id=str(m.id),
                session_at=m.session_at,
                activity_type_id=act_id,
                activity_type_name=act_name,
                intensity=m.intensity,
                status=m.status,
                measurements=meas,
            )
        )
    return inputs


def get_user_summary(
    db: Session,
    user_id: str,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
) -> Dict[str, Any]:
    inputs = _load_user_session_inputs(db, user_id, date_from, date_to)
    return compute_summary(inputs)


def get_user_progress(
    db: Session,
    user_id: str,
    metric: Literal["sessions", "duration_min", "distance_km"] = "sessions",
    granularity: Literal["week", "month"] = "week",
    activity_type_id: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
) -> Dict[str, Any]:
    inputs = _load_user_session_inputs(db, user_id, date_from, date_to)
    series = compute_progress_series(
        sessions=inputs,
        metric=metric,
        granularity=granularity,
        activity_type_id=activity_type_id,
    )
    return {
        "metric": metric,
        "granularity": granularity,
        "series": series,
    }
