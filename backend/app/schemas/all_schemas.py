from datetime import datetime
from typing import Any, List, Optional  # noqa: F401, UP035

from app.models.entities import (
    MemoType,
    PaymentMethod,
    ProductType,
    SubscriptionStatus,
    TransactionStatus,
    UserRole,
)
from pydantic import BaseModel, EmailStr, Field


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: Optional[str] = None  # noqa: UP045
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    phone_number: Optional[str]  # noqa: UP045
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Product Schemas
class ProductCreate(BaseModel):
    title: str
    badge: Optional[str] = None  # noqa: UP045
    description: Optional[str] = None  # noqa: UP045
    product_type: ProductType
    price_bdt: float
    features: List[str] = []  # noqa: UP006
    icon_name: Optional[str] = None  # noqa: UP045


class ProductUpdate(BaseModel):
    title: Optional[str] = None  # noqa: UP045
    badge: Optional[str] = None  # noqa: UP045
    description: Optional[str] = None  # noqa: UP045
    product_type: Optional[ProductType] = None  # noqa: UP045
    price_bdt: Optional[float] = None  # noqa: UP045
    features: Optional[List[str]] = None  # noqa: UP006, UP045
    icon_name: Optional[str] = None  # noqa: UP045
    is_active: Optional[bool] = None  # noqa: UP045


class ProductResponse(BaseModel):
    id: str
    title: str
    badge: Optional[str]  # noqa: UP045
    description: Optional[str]  # noqa: UP045
    product_type: ProductType
    price_bdt: float
    features: List[str]  # noqa: UP006
    icon_name: Optional[str]  # noqa: UP045
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Checkout & Transaction Schemas
class CheckoutSubmit(BaseModel):
    product_id: str
    product_title: Optional[str] = None  # noqa: UP045
    price_bdt: Optional[float] = None  # noqa: UP045
    payment_method: PaymentMethod
    transaction_id: str
    sender_account: Optional[str] = None  # noqa: UP045
    memo_type: MemoType = MemoType.FUND_TRANSFER

    # Optional memo custom fields
    student_id: Optional[str] = None  # noqa: UP045
    biller_name: Optional[str] = None  # noqa: UP045
    nexus_pay_id: Optional[str] = None  # noqa: UP045


class TransactionStatusUpdate(BaseModel):
    status: TransactionStatus
    access_credentials: Optional[str] = None  # noqa: UP045


class TransactionMemoResponse(BaseModel):
    id: str
    transaction_id: str
    memo_type: MemoType
    receiver_name: Optional[str]  # noqa: UP045
    receiver_bank: Optional[str]  # noqa: UP045
    receiver_account: Optional[str]  # noqa: UP045
    sender_card_type: Optional[str]  # noqa: UP045
    sender_card_number: Optional[str]  # noqa: UP045
    nexus_pay_id: Optional[str]  # noqa: UP045
    biller_name: Optional[str]  # noqa: UP045
    biller_code: Optional[str]  # noqa: UP045
    student_id: Optional[str]  # noqa: UP045
    paid_from_channel: Optional[str]  # noqa: UP045
    fee_bdt: float
    formatted_timestamp: Optional[str]  # noqa: UP045
    raw_reference: Optional[str]  # noqa: UP045

    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    id: str
    order_id: str
    user_id: str
    product_id: Optional[str]  # noqa: UP045
    product_title: Optional[str] = None  # noqa: UP045
    amount_bdt: float
    payment_method: PaymentMethod
    transaction_id: str
    sender_account: Optional[str]  # noqa: UP045
    memo_type: MemoType
    status: TransactionStatus
    created_at: datetime
    memo: Optional[TransactionMemoResponse] = None  # noqa: UP045

    class Config:
        from_attributes = True


class SubscriptionResponse(BaseModel):
    id: str
    product_id: str
    product_title: Optional[str] = None  # noqa: UP045
    start_date: datetime
    end_date: datetime
    status: SubscriptionStatus
    access_credentials: Optional[str]  # noqa: UP045
    days_remaining: Optional[int] = None  # noqa: UP045

    class Config:
        from_attributes = True


class GenerateMemoRequest(BaseModel):
    transaction_id: str  # The bank Trx ID or DB UUID
    memo_type: MemoType = MemoType.FUND_TRANSFER
    amount_bdt: float
    receiver_name: Optional[str] = "EZOPY MART TECH"  # noqa: UP045
    receiver_account: Optional[str] = "107.110.198425"  # noqa: UP045
    sender_card_type: Optional[str] = "NEXUS DEBIT"  # noqa: UP045
    sender_card_number: Optional[str] = "9011-XXXX-XXXX-4581"  # noqa: UP045
    nexus_pay_id: Optional[str] = "NX-882941"  # noqa: UP045
    biller_name: Optional[str] = "EZOPY MART TECH Educational Cloud"  # noqa: UP045
    biller_code: Optional[str] = "EM-9021"  # noqa: UP045
    student_id: Optional[str] = "EWU-2022-1-60-019"  # noqa: UP045
    paid_from_channel: Optional[str] = "ROCKET WALLET"  # noqa: UP045
