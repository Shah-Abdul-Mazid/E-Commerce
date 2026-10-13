import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"

class ProductType(str, enum.Enum):
    PACKAGE = "PACKAGE"
    SINGLE_TOOL = "SINGLE_TOOL"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    PENDING = "PENDING"

class PaymentMethod(str, enum.Enum):
    SSLCOMMERZ = "SSLCOMMERZ"
    BKASH = "BKASH"
    NAGAD = "NAGAD"
    ROCKET = "ROCKET"
    NEXUSPAY_DBBL = "NEXUSPAY_DBBL"

class MemoType(str, enum.Enum):
    FUND_TRANSFER = "FUND_TRANSFER"
    BILL_PAYMENT = "BILL_PAYMENT"

class TransactionStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(30), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    badge: Mapped[str] = mapped_column(String(100), nullable=True)  # e.g. "MOST POPULAR", "SEO BUNDLE"
    description: Mapped[str] = mapped_column(Text, nullable=True)
    product_type: Mapped[ProductType] = mapped_column(SQLEnum(ProductType), nullable=False)
    price_bdt: Mapped[float] = mapped_column(Float, nullable=False)
    features: Mapped[list] = mapped_column(JSON, default=list)  # list of bundled features/tools
    icon_name: Mapped[str] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    subscriptions = relationship("Subscription", back_populates="product")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    end_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[SubscriptionStatus] = mapped_column(SQLEnum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE)
    access_credentials: Mapped[str] = mapped_column(Text, nullable=True) # Tool credentials issued

    user = relationship("User", back_populates="subscriptions")
    product = relationship("Product", back_populates="subscriptions")

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id"), nullable=True)
    amount_bdt: Mapped[float] = mapped_column(Float, nullable=False)
    payment_method: Mapped[PaymentMethod] = mapped_column(SQLEnum(PaymentMethod), nullable=False)
    transaction_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)  # e.g., LID02082191058
    sender_account: Mapped[str] = mapped_column(String(128), nullable=True)
    memo_type: Mapped[MemoType] = mapped_column(SQLEnum(MemoType), default=MemoType.FUND_TRANSFER)
    status: Mapped[TransactionStatus] = mapped_column(SQLEnum(TransactionStatus), default=TransactionStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")
    memo = relationship("TransactionMemo", back_populates="transaction", uselist=False, cascade="all, delete-orphan")

class TransactionMemo(Base):
    __tablename__ = "transaction_memos"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    transaction_id: Mapped[str] = mapped_column(String(36), ForeignKey("transactions.id"), unique=True, nullable=False)
    memo_type: Mapped[MemoType] = mapped_column(SQLEnum(MemoType), default=MemoType.FUND_TRANSFER)
    
    # Fund Transfer Memo Fields
    receiver_name: Mapped[str] = mapped_column(String(255), nullable=True)
    receiver_bank: Mapped[str] = mapped_column(String(255), default="Dutch-Bangla Bank PLC")
    receiver_account: Mapped[str] = mapped_column(String(100), nullable=True)
    sender_card_type: Mapped[str] = mapped_column(String(100), default="NEXUS DEBIT", nullable=True)
    sender_card_number: Mapped[str] = mapped_column(String(100), nullable=True)
    nexus_pay_id: Mapped[str] = mapped_column(String(100), nullable=True)
    
    # Bill Payment Memo Fields
    biller_name: Mapped[str] = mapped_column(String(255), nullable=True)
    biller_code: Mapped[str] = mapped_column(String(100), nullable=True)
    student_id: Mapped[str] = mapped_column(String(100), nullable=True)
    paid_from_channel: Mapped[str] = mapped_column(String(100), default="ROCKET / CARD", nullable=True)
    fee_bdt: Mapped[float] = mapped_column(Float, default=0.0)
    
    formatted_timestamp: Mapped[str] = mapped_column(String(100), nullable=True)
    raw_reference: Mapped[str] = mapped_column(String(128), nullable=True)

    transaction = relationship("Transaction", back_populates="memo")
