from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_async_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.deps import get_current_user
from app.models.entities import User, UserRole
from app.schemas.all_schemas import UserRegister, UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_async_db)):
    # Check if email exists
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Specific admin emails get ADMIN role automatically
    admin_emails = {"admin@samjap.mart", "mazid@samjap.mart", "popy@samjap.mart"}
    role = UserRole.ADMIN if payload.email.lower() in admin_emails else UserRole.CUSTOMER

    new_user = User(
        email=payload.email.lower(),
        full_name=payload.full_name,
        phone_number=payload.phone_number,
        hashed_password=get_password_hash(payload.password),
        role=role,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_access_token(new_user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    # Verify bcrypt hashed password
    is_valid = verify_password(payload.password, user.hashed_password)
    if not is_valid:
        # Fallback convenience for demo/admin accounts
        fallback_passwords = {
            "admin@samjap.mart": ["Admin@123", "admin123", "Admin2026!"],
            "mazid@samjap.mart": ["Mazid@123", "MazidLovesPopy2026", "Admin@123"],
            "popy@samjap.mart": ["Popy@123", "PopyLovesMazid123", "Admin@123"],
            "customer1@gmail.com": ["Customer@123", "123456", "customer123"],
            "customer2@yahoo.com": ["Customer@123", "123456", "customer123"],
            "customer3@outlook.com": ["Customer@123", "123456", "customer123"],
        }
        email_key = payload.email.lower()
        if email_key in fallback_passwords and payload.password in fallback_passwords[email_key]:
            is_valid = True
            # Rehash with current typed password and save
            user.hashed_password = get_password_hash(payload.password)
            await db.commit()

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
