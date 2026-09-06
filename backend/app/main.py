from fastapi import FastAPI
from app.api.health import router as health_router

app = FastAPI(
    title="Exercise Progress Tracker",
    description="Backend API for Exercise Progress Tracker",
    version="0.1.0",
)

app.include_router(health_router)

@app.get("/")
def read_root():
    return {"message": "Exercise Progress Tracker API is running"}
