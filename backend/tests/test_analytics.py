from datetime import datetime
import pytest

from app.services.analytics import (
    MeasurementInput,
    SessionInput,
    compute_progress_series,
    compute_streaks,
    compute_summary,
)


@pytest.fixture
def sample_sessions():
    return [
        SessionInput(
            id="s1",
            session_at=datetime(2026, 11, 2, 8, 30),
            activity_type_id="act-run",
            activity_type_name="Running",
            intensity=3,
            measurements=[
                MeasurementInput(unit_slug="duration_min", actual_value=45.0),
                MeasurementInput(unit_slug="distance_km", actual_value=7.5),
            ],
        ),
        SessionInput(
            id="s2",
            session_at=datetime(2026, 11, 3, 17, 0),
            activity_type_id="act-gym",
            activity_type_name="Gym",
            intensity=5,
            measurements=[
                MeasurementInput(unit_slug="duration_min", actual_value=60.0),
            ],
        ),
        SessionInput(
            id="s3",
            session_at=datetime(2026, 11, 10, 9, 0),
            activity_type_id="act-run",
            activity_type_name="Running",
            intensity=4,
            measurements=[
                MeasurementInput(unit_slug="duration_min", actual_value=30.0),
                MeasurementInput(unit_slug="distance_km", actual_value=5.0),
            ],
        ),
        SessionInput(
            id="s4-unscheduled",
            session_at=None,
            activity_type_id="act-plan",
            activity_type_name="Plan",
            intensity=2,
            measurements=[
                MeasurementInput(unit_slug="duration_min", planned_value=50.0),
            ],
        ),
    ]


def test_compute_summary_empty():
    res = compute_summary([])
    assert res["session_count"] == 0
    assert res["total_duration_min"] == 0.0
    assert res["total_distance_km"] == 0.0
    assert res["avg_intensity"] == 0.0
    assert res["by_activity"] == {}


def test_compute_summary_valid(sample_sessions):
    res = compute_summary(sample_sessions)
    assert res["session_count"] == 3
    assert res["total_duration_min"] == 135.0
    assert res["total_distance_km"] == 12.5
    assert res["avg_intensity"] == 4.0
    assert res["by_activity"]["Running"]["session_count"] == 2
    assert res["by_activity"]["Running"]["distance_km"] == 12.5
    assert res["by_activity"]["Gym"]["session_count"] == 1


def test_compute_progress_series(sample_sessions):
    series = compute_progress_series(sample_sessions, metric="distance_km", granularity="week")
    assert len(series) == 2
    assert series[0] == {"period_label": "2026-W45", "value": 7.5}
    assert series[1] == {"period_label": "2026-W46", "value": 5.0}

    month_series = compute_progress_series(sample_sessions, metric="sessions", granularity="month")
    assert len(month_series) == 1
    assert month_series[0] == {"period_label": "2026-11", "value": 3.0}


def test_compute_streaks():
    assert compute_streaks([]) == {"current": 0, "longest": 0}

    days = [
        SessionInput(id="1", session_at=datetime(2026, 11, 1)),
        SessionInput(id="2", session_at=datetime(2026, 11, 2)),
        SessionInput(id="3", session_at=datetime(2026, 11, 3)),
        SessionInput(id="4", session_at=datetime(2026, 11, 5)),
    ]
    res = compute_streaks(days, today=datetime(2026, 11, 3))
    assert res["longest"] == 3
    assert res["current"] == 3
