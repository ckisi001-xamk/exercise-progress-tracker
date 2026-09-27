from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    sqladmin_username: str = "admin"
    sqladmin_password: str = "admin"
    sqladmin_secret_key: str = "insecure-secret-key-change-in-production"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
