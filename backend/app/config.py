import os
from pathlib import Path
from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import ConfigDict


def get_database_path() -> str:
    """Get the SQLite database file path in the user's AppData folder."""
    appdata = os.getenv('APPDATA') or os.path.expanduser('~')
    app_dir = Path(appdata) / "MotorcycleParts"
    app_dir.mkdir(parents=True, exist_ok=True)
    db_file = app_dir / "inventory.db"
    return str(db_file).replace('\\', '/')


def get_logs_path() -> str:
    """Get the logs directory path in the user's AppData folder."""
    appdata = os.getenv('APPDATA') or os.path.expanduser('~')
    logs_dir = Path(appdata) / "MotorcycleParts" / "logs"
    logs_dir.mkdir(parents=True, exist_ok=True)
    return str(logs_dir)

# Pre‑calculate the database URL for FastAPI
_DATABASE_URL = f"sqlite:///{get_database_path()}"

class Settings(BaseSettings):
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000
    DATABASE_URL: str = _DATABASE_URL

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

@lru_cache()
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()
