from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.services.health import check_health

router = APIRouter(tags=["health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    return check_health()
