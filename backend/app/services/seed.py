from sqlalchemy.orm import Session
from app.repositories import unit_type as unit_repo
from app.repositories import activity_type as act_repo

def seed_catalog(db: Session) -> None:
    # 1. Mittayksiköt
    units_data = [
        {"name": "Duration", "slug": "duration_min", "label": "min"},
        {"name": "Distance", "slug": "distance_km", "label": "km"},
        {"name": "Reps", "slug": "reps", "label": "reps"},
        {"name": "Weight", "slug": "weight_kg", "label": "kg"},
    ]
    units = {}
    for u in units_data:
        unit = unit_repo.get_by_slug(db, u["slug"])
        if not unit:
            unit = unit_repo.create(db, name=u["name"], slug=u["slug"], unit_label=u["label"], is_system=True)
        units[u["slug"]] = unit

    # 2. Harjoitteet
    cardio_acts = [
        {"name": "Running", "slug": "running"},
        {"name": "Cycling", "slug": "cycling"},
    ]
    strength_acts = [
        {"name": "Bench Press", "slug": "bench_press"},
        {"name": "Barbell Curl", "slug": "barbell_curl"},
        {"name": "Hammer Curl", "slug": "hammer_curl"},
        {"name": "Incline Curl", "slug": "incline_curl"},
        {"name": "Face Pull", "slug": "face_pull"},
    ]

    # Kardiolinkitykset (per_set=False)
    for act_def in cardio_acts:
        act = act_repo.get_by_slug(db, act_def["slug"])
        if not act:
            act = act_repo.create(db, name=act_def["name"], slug=act_def["slug"], is_system=True)
        act_repo.link_unit(db, act.id, units["duration_min"].id, sort_order=1, per_set=False)
        act_repo.link_unit(db, act.id, units["distance_km"].id, sort_order=2, per_set=False)

    # Voimalinkitykset (per_set=True)
    for act_def in strength_acts:
        act = act_repo.get_by_slug(db, act_def["slug"])
        if not act:
            act = act_repo.create(db, name=act_def["name"], slug=act_def["slug"], is_system=True)
        act_repo.link_unit(db, act.id, units["reps"].id, sort_order=1, per_set=True)
        act_repo.link_unit(db, act.id, units["weight_kg"].id, sort_order=2, per_set=True)

    # Muu
    other = act_repo.get_by_slug(db, "other")
    if not other:
        other = act_repo.create(db, name="Other", slug="other", is_system=True)
    act_repo.link_unit(db, other.id, units["duration_min"].id, sort_order=1, per_set=False)

    db.commit()
