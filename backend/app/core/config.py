import os
from pathlib import Path
from typing import List  # noqa: UP035
from urllib.parse import quote_plus, unquote

from dotenv import load_dotenv

# Load backend/.env and root .env if present
_backend_dir = Path(__file__).resolve().parents[2]
load_dotenv(_backend_dir / ".env")
load_dotenv(_backend_dir.parent / ".env")


def sanitize_mongodb_uri(raw_uri: str) -> str:
    """
    Safely URL-encode username and password in a MongoDB connection URI
    even when the password contains special characters like '@' or '$'.
    """
    uri = raw_uri.strip()
    if not (uri.startswith(("mongodb://", "mongodb+srv://"))):
        return uri

    scheme, rest = uri.split("://", 1)
    if "@" not in rest:
        return uri

    # Split on the LAST '@' because the host part never contains '@'
    creds, host_part = rest.rsplit("@", 1)
    if ":" not in creds:
        return f"{scheme}://{quote_plus(unquote(creds))}@{host_part}"

    user, pwd = creds.split(":", 1)
    encoded_user = quote_plus(unquote(user))
    encoded_pwd = quote_plus(unquote(pwd))
    return f"{scheme}://{encoded_user}:{encoded_pwd}@{host_part}"


class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "EZOPY MART TECH")
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7))
    )

    # MongoDB Atlas Connection URI read strictly from environment (.env)
    _raw_mongo_uri: str = (
        os.getenv("MONGODB_DATABASE")
        or os.getenv("MONGODB_URI")
        or os.getenv("MONGO_URI")
        or os.getenv("DATABASE_URL")
        or ""
    )
    MONGODB_URI: str = sanitize_mongodb_uri(_raw_mongo_uri)
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "EcommarceDB")

    # Payment & Receiver Settings from environment (.env)
    DBBL_RECEIVER_NAME: str = os.getenv("DBBL_RECEIVER_NAME", "EZOPY MART TECH")
    DBBL_RECEIVER_BANK: str = os.getenv("DBBL_RECEIVER_BANK", "Dutch-Bangla Bank PLC")
    DBBL_RECEIVER_ACCOUNT: str = os.getenv("DBBL_RECEIVER_ACCOUNT", "")

    # CORS Origins from environment (.env)
    BACKEND_CORS_ORIGINS: List[str] = [  # noqa: RUF012, UP006
        origin.strip()
        for origin in os.getenv("BACKEND_CORS_ORIGINS", "*").split(",")
        if origin.strip()
    ]


settings = Settings()
