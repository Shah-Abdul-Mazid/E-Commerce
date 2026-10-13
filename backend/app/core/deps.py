from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.core.database import get_async_db
from app.models.entities import UserRole
from app.schemas.all_schemas import UserResponse

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_async_db),
) -> UserResponse:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user_doc = await db["users"].find_one({"id": user_id})
    if user_doc is None or not user_doc.get("is_active", True):
        raise credentials_exception

    return UserResponse(
        id=user_doc["id"],
        email=user_doc["email"],
        full_name=user_doc["full_name"],
        phone_number=user_doc.get("phone_number"),
        role=UserRole(user_doc.get("role", UserRole.CUSTOMER.value)),
        is_active=user_doc.get("is_active", True),
        created_at=user_doc["created_at"],
    )


async def get_current_admin(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have sufficient administrative privileges",
        )
    return current_user
