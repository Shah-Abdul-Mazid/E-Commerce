import os
import uuid
from datetime import datetime

from app.core.database import get_async_db
from app.core.deps import get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.entities import UserRole
from app.schemas.all_schemas import TokenResponse, UserLogin, UserRegister, UserResponse
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _get_admin_emails() -> set:
    emails = {
        os.getenv("ADMIN_EMAIL", "").lower(),
        os.getenv("MAZID_EMAIL", "").lower(),
        os.getenv("POPY_EMAIL", "").lower(),
    }
    emails.discard("")
    return emails


@router.post("/register", response_model=TokenResponse)
async def register(
    payload: UserRegister,
    db: AsyncIOMotorDatabase = Depends(get_async_db),  # noqa: B008
):
    email_lower = payload.email.lower()
    existing = await db["users"].find_one({"email": email_lower})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists.",
        )

    role = UserRole.ADMIN if email_lower in _get_admin_emails() else UserRole.CUSTOMER

    user_doc = {
        "id": str(uuid.uuid4()),
        "email": email_lower,
        "full_name": payload.full_name,
        "phone_number": payload.phone_number,
        "hashed_password": get_password_hash(payload.password),
        "role": role.value,
        "is_active": True,
        "created_at": datetime.utcnow(),  # noqa: DTZ003
    }
    await db["users"].insert_one(user_doc)

    user_resp = UserResponse(
        id=user_doc["id"],
        email=user_doc["email"],
        full_name=user_doc["full_name"],
        phone_number=user_doc["phone_number"],
        role=role,
        is_active=user_doc["is_active"],
        created_at=user_doc["created_at"],
    )
    token = create_access_token(user_doc["id"])
    return TokenResponse(access_token=token, token_type="bearer", user=user_resp)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncIOMotorDatabase = Depends(get_async_db)):  # noqa: B008
    email_lower = payload.email.lower()
    user_doc = await db["users"].find_one({"email": email_lower})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    is_valid = verify_password(payload.password, user_doc["hashed_password"])
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    user_resp = UserResponse(
        id=user_doc["id"],
        email=user_doc["email"],
        full_name=user_doc["full_name"],
        phone_number=user_doc.get("phone_number"),
        role=UserRole(user_doc.get("role", UserRole.CUSTOMER.value)),
        is_active=user_doc.get("is_active", True),
        created_at=user_doc["created_at"],
    )
    token = create_access_token(user_doc["id"])
    return TokenResponse(access_token=token, token_type="bearer", user=user_resp)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):  # noqa: B008
    return current_user
