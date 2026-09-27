from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from app.api.health import router as health_router
from app.db.session import engine
from app.admin import setup_admin
from app.core.config import settings

app = FastAPI(title="Exercise Progress Tracker API")

app.add_middleware(SessionMiddleware, secret_key=settings.sqladmin_secret_key)

app.include_router(health_router)

setup_admin(app, engine)
