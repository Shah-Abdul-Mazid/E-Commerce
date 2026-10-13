from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime
from app.models.entities import UserRole, ProductType, SubscriptionStatus, PaymentMethod, MemoType, TransactionStatus

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: Optional[str] = None
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    phone_number: Optional[str]
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
    badge: Optional[str] = None
    description: Optional[str] = None
    product_type: ProductType
    price_bdt: float
    features: List[str] = []
    icon_name: Optional[str] = None

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    badge: Optional[str] = None
    description: Optional[str] = None
    product_type: Optional[ProductType] = None
    price_bdt: Optional[float] = None
    features: Optional[List[str]] = None
    icon_name: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(BaseModel):
    id: str
    title: str
    badge: Optional[str]
    description: Optional[str]
    product_type: ProductType
    price_bdt: float
    features: List[str]
    icon_name: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Checkout & Transaction Schemas
class CheckoutSubmit(BaseModel):
    product_id: str
    product_title: Optional[str] = None
    price_bdt: Optional[float] = None
    payment_method: PaymentMethod
    transaction_id: str
    sender_account: Optional[str] = None
    memo_type: MemoType = MemoType.FUND_TRANSFER
    
    # Optional memo custom fields
    student_id: Optional[str] = None
    biller_name: Optional[str] = None
    nexus_pay_id: Optional[str] = None

class TransactionStatusUpdate(BaseModel):
    status: TransactionStatus
    access_credentials: Optional[str] = None

class TransactionMemoResponse(BaseModel):
    id: str
    transaction_id: str
    memo_type: MemoType
    receiver_name: Optional[str]
    receiver_bank: Optional[str]
    receiver_account: Optional[str]
    sender_card_type: Optional[str]
    sender_card_number: Optional[str]
    nexus_pay_id: Optional[str]
    biller_name: Optional[str]
    biller_code: Optional[str]
    student_id: Optional[str]
    paid_from_channel: Optional[str]
    fee_bdt: float
    formatted_timestamp: Optional[str]
    raw_reference: Optional[str]

    class Config:
        from_attributes = True

class TransactionResponse(BaseModel):
    id: str
    order_id: str
    user_id: str
    product_id: Optional[str]
    product_title: Optional[str] = None
    amount_bdt: float
    payment_method: PaymentMethod
    transaction_id: str
    sender_account: Optional[str]
    memo_type: MemoType
    status: TransactionStatus
    created_at: datetime
    memo: Optional[TransactionMemoResponse] = None

    class Config:
        from_attributes = True

class SubscriptionResponse(BaseModel):
    id: str
    product_id: str
    product_title: Optional[str] = None
    start_date: datetime
    end_date: datetime
    status: SubscriptionStatus
    access_credentials: Optional[str]
    days_remaining: Optional[int] = None

    class Config:
        from_attributes = True

class GenerateMemoRequest(BaseModel):
    transaction_id: str # The bank Trx ID or DB UUID
    memo_type: MemoType = MemoType.FUND_TRANSFER
    amount_bdt: float
    receiver_name: Optional[str] = "SOFTMART IT ENTERPRISE"
    receiver_account: Optional[str] = "107.110.198425"
    sender_card_type: Optional[str] = "NEXUS DEBIT"
    sender_card_number: Optional[str] = "9011-XXXX-XXXX-4581"
    nexus_pay_id: Optional[str] = "NX-882941"
    biller_name: Optional[str] = "SoftMart Educational Cloud"
    biller_code: Optional[str] = "SM-9021"
    student_id: Optional[str] = "EWU-2022-1-60-019"
    paid_from_channel: Optional[str] = "ROCKET WALLET"
