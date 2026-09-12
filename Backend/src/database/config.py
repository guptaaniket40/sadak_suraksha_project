import os
from pathlib import Path
from enum import Enum
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)


def _build_db_url() -> str:
    """
    Builds an async-compatible PostgreSQL SQLAlchemy DB URL.
    """
    raw_url = os.getenv("DATABASE_URL", "").strip()

    if not raw_url:
        raise ValueError("DATABASE_URL is required and must point to PostgreSQL.")

    if raw_url.startswith("postgresql+asyncpg://"):
        return raw_url
    if raw_url.startswith("postgresql://"):
        return raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)

    raise ValueError("DATABASE_URL must start with postgresql:// or postgresql+asyncpg://.")


class Config:
    PORT = int(os.getenv("PORT", 5000))
    DB_CONFIG = _build_db_url()

    JWT_SECRET = os.getenv("JWT_SECRET", "sadak_suraksha_super_secret_jwt_key_2026")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", 1440))

    BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")

    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "tngtech/deepseek-r1t2-chimera:free")
    OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


class AllEnum:
    class RoleEnum(str, Enum):
        USER = "user"
        ADMIN = "admin"

    class PriorityEnum(str, Enum):
        HIGH = "High"
        MEDIUM = "Medium"
        LOW = "Low"

    class ReportStatusEnum(str, Enum):
        SUBMITTED = "Submitted"
        UNDER_REVIEW = "Under Review"
        IN_PROGRESS = "In Progress"
        RESOLVED = "Resolved"
        REJECTED = "Rejected"
