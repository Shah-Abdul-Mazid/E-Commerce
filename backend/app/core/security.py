from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union  # noqa: F401

import bcrypt
from app.core.config import settings
from jose import jwt


def get_password_hash(password: str) -> str:
    pwd_bytes = password[:72].encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password[:72].encode("utf-8")
    try:
        return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
    except Exception:  # noqa: BLE001
        return False


def create_access_token(
    subject: str | Any, expires_delta: timedelta | None = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta  # noqa: UP017
    else:
        expire = datetime.now(timezone.utc) + timedelta(  # noqa: UP017
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt
