from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    sqladmin_username: str = "admin"
    sqladmin_password: str = "admin"
    sqladmin_secret_key: str = "insecure-secret-key-change-in-production"
    jwt_secret: str = "insecure-jwt-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
