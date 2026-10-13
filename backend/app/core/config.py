import os
from typing import List


class Settings:
    PROJECT_NAME: str = "SAMJAP Mart — Shah Abdul Mazid ❤️ Jannat Farhana Popy"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "samjap-mart-mazid-loves-popy-romantic-secret-key-2026"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database URL: Supports PostgreSQL (asyncpg) or SQLite (aiosqlite) as default fallback
    # On Vercel serverless functions, /var/task is read-only so default SQLite uses /tmp
    _default_sqlite_url: str = (
        "sqlite+aiosqlite:////tmp/samjap_mart.db"
        if os.getenv("VERCEL")
        else "sqlite+aiosqlite:///./samjap_mart.db"
    )
    _raw_db_url: str = os.getenv("DATABASE_URL", _default_sqlite_url)
    if _raw_db_url.startswith("postgres://"):
        DATABASE_URL: str = _raw_db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif _raw_db_url.startswith("postgresql://") and not _raw_db_url.startswith("postgresql+asyncpg://"):
        DATABASE_URL: str = _raw_db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    else:
        DATABASE_URL: str = _raw_db_url

    # Dutch-Bangla Bank & Payment Settings
    DBBL_RECEIVER_NAME: str = os.getenv(
        "DBBL_RECEIVER_NAME", "SAMJAP MART (MAZID & POPY)"
    )
    DBBL_RECEIVER_BANK: str = "Dutch-Bangla Bank PLC"
    DBBL_RECEIVER_ACCOUNT: str = os.getenv("DBBL_RECEIVER_ACCOUNT", "107.110.198425")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "*",
    ]


settings = Settings()
