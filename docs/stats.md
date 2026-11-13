# Analytics & Stats Contract (Sprint 4)

This document describes the user-scoped analytics endpoints, aggregation rules, and unit test execution for Sprint 4. Full interactive request/response schemas are available in Swagger UI at `http://localhost:8000/docs`.

## Architecture & Security Principles

- **Pure Analytics Layer:** All aggregation math resides in `backend/app/services/analytics.py` as pure Python functions with zero FastAPI or SQLAlchemy dependencies.
- **Measurement Unit Slugs:** Volume metrics (`duration_min`, `distance_km`) are aggregated from session measurements by unit slug (using actual values when recorded).
- **Strict User Scoping (IDOR Prevention):** Every `/stats/*` endpoint requires a valid Bearer JWT token (`get_current_user`). Data is filtered by `current_user.id` at the repository layer prior to aggregation; client-supplied `user_id` parameters are never accepted.
- **Timestamp Rules (`session_at`):** Time-series bucketing, period filtering, and streak calculations evaluate sessions with a non-null `session_at` timestamp. Unscheduled sessions (`session_at IS NULL`) are excluded from period/streak metrics.

## Endpoints

All endpoints require the `Authorization: Bearer <access_token>` header.

| Endpoint | Method | Query Parameters | Purpose |
| :--- | :--- | :--- | :--- |
| `/stats/summary` | `GET` | `from` (optional ISO datetime), `to` (optional ISO datetime) | Returns total session count, total duration (`duration_min`), total distance (`distance_km`), average intensity, and per-activity breakdown for the period. |
| `/stats/progress` | `GET` | `metric` (`sessions` \| `duration_min` \| `distance_km`), `granularity` (`week` \| `month`), `activity_type_id` (optional), `from` (optional), `to` (optional) | Returns time-series data points (`{ period_label, value }`) grouped by ISO week (`YYYY-Www`, Monday start) or calendar month (`YYYY-MM`). Invalid metric/granularity returns `422`. |
| `/stats/streaks` | `GET` | *(none)* | Returns `{ current, longest }` training consistency streaks across the user's scheduled session history. |

## Streak Definition

Training streaks measure consecutive active calendar days (`current` and `longest`) derived from unique dates with at least one scheduled session (`session_at IS NOT NULL`). Multiple sessions logged on the same calendar day count as a single active day. The `current` streak counts consecutive active days leading up to today (or yesterday if no session has been logged yet today), whereas `longest` records the maximum consecutive day run across the user's full session history. Empty or sparse histories safely return `0`.

## Running Analytics Unit Tests

Pure analytics functions are verified independently of PostgreSQL and FastAPI using `pytest` fixtures:

```bash
# Run from the repository root
pytest backend/tests/test_analytics.py -v