from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session, joinedload

from app.models.workout_session import WorkoutSession
from app.models.workout_session_item import WorkoutSessionItem
from app.models.activity_type import ActivityType
from app.models.unit_type import UnitType
from app.services.analytics import MeasurementInput, SessionInput, compute_summary


def get_user_summary(
    db: Session,
    user_id: str,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
) -> Dict[str, Any]:
    # 1. Lookup-taulut muistiin yhdellä keveällä SELECTillä
    unit_map = {str(u.id): u.slug for u in db.query(UnitType).all()}
    act_map = {str(a.id): a.name for a in db.query(ActivityType).all()}

    # 2. Haetaan sessiot ja niihin kuuluvat itemit + mittaukset
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

    # 3. Muodostetaan analytiikkakerroksen SessionInput-oliot
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

    return compute_summary(inputs)
