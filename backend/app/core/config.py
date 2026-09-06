from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: list[str] = ["http://localhost:5173"]
    
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_db: str = "exercisetracker"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/exercisetracker"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
