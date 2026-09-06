from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.core.config import settings

app = FastAPI(
    title="Exercise Progress Tracker",
    description="Backend API for Exercise Progress Tracker",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)

@app.get("/")
def read_root():
    return {"message": "Exercise Progress Tracker API is running"}
