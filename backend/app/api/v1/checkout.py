from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid
from datetime import datetime, timedelta

from app.core.database import get_async_db
from app.core.deps import get_current_user, get_current_admin
from app.core.config import settings
from app.models.entities import (
    Transaction, TransactionMemo, Product, Subscription, User,
    TransactionStatus, SubscriptionStatus, MemoType
)
from app.schemas.all_schemas import (
    CheckoutSubmit, TransactionResponse, TransactionStatusUpdate, SubscriptionResponse
)

router = APIRouter(prefix="/checkout", tags=["Checkout & Subscriptions"])

@router.post("/submit", response_model=TransactionResponse)
async def submit_checkout(
    payload: CheckoutSubmit,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch Product
    result = await db.execute(select(Product).where(Product.id == payload.product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Selected product or package not found.")

    order_id = f"SM-{uuid.uuid4().hex[:8].upper()}"
    now_str = datetime.now().strftime("%d-%b-%Y %I:%M:%S %p")

    # Create Transaction
    trx = Transaction(
        order_id=order_id,
        user_id=current_user.id,
        product_id=product.id,
        amount_bdt=product.price_bdt,
        payment_method=payload.payment_method,
        transaction_id=payload.transaction_id.strip(),
        sender_account=payload.sender_account,
        memo_type=payload.memo_type,
        status=TransactionStatus.PENDING,
    )
    db.add(trx)
    await db.flush()

    # Automatically generate corresponding Dutch-Bangla Bank / NexusPay Transaction Memo
    memo = TransactionMemo(
        transaction_id=trx.id,
        memo_type=payload.memo_type,
        receiver_name=settings.DBBL_RECEIVER_NAME,
        receiver_bank=settings.DBBL_RECEIVER_BANK,
        receiver_account=settings.DBBL_RECEIVER_ACCOUNT,
        sender_card_type="NEXUS DEBIT",
        sender_card_number=f"9011-XXXX-XXXX-{payload.sender_account[-4:] if payload.sender_account and len(payload.sender_account) >= 4 else '4581'}",
        nexus_pay_id=payload.nexus_pay_id or f"NX-{uuid.uuid4().hex[:6].upper()}",
        biller_name=payload.biller_name or (product.title if payload.memo_type == MemoType.BILL_PAYMENT else "East West University"),
        biller_code="DBBL-EDU-8810",
        student_id=payload.student_id or f"STU-{uuid.uuid4().hex[:8].upper()}",
        paid_from_channel=payload.payment_method.value,
        fee_bdt=0.00,
        formatted_timestamp=now_str,
        raw_reference=order_id,
    )
    db.add(memo)
    await db.commit()

    # Load with relationship
    stmt = (
        select(Transaction)
        .where(Transaction.id == trx.id)
        .options(selectinload(Transaction.memo))
    )
    res = await db.execute(stmt)
    full_trx = res.scalar_one()

    resp = TransactionResponse.model_validate(full_trx)
    resp.product_title = product.title
    return resp

@router.get("/my-history", response_model=List[TransactionResponse])
async def get_my_transactions(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    stmt = (
        select(Transaction)
        .where(Transaction.user_id == current_user.id)
        .options(selectinload(Transaction.memo))
        .order_by(Transaction.created_at.desc())
    )
    res = await db.execute(stmt)
    transactions = res.scalars().all()

    # Get product titles
    output = []
    for t in transactions:
        t_resp = TransactionResponse.model_validate(t)
        if t.product_id:
            p_res = await db.execute(select(Product.title).where(Product.id == t.product_id))
            t_resp.product_title = p_res.scalar_one_or_none()
        output.append(t_resp)
    return output

@router.get("/all-transactions", response_model=List[TransactionResponse])
async def get_all_transactions(
    db: AsyncSession = Depends(get_async_db),
    admin: User = Depends(get_current_admin)
):
    stmt = (
        select(Transaction)
        .options(selectinload(Transaction.memo))
        .order_by(Transaction.created_at.desc())
    )
    res = await db.execute(stmt)
    transactions = res.scalars().all()

    output = []
    for t in transactions:
        t_resp = TransactionResponse.model_validate(t)
        if t.product_id:
            p_res = await db.execute(select(Product.title).where(Product.id == t.product_id))
            t_resp.product_title = p_res.scalar_one_or_none()
        output.append(t_resp)
    return output

@router.patch("/status/{trx_id}", response_model=TransactionResponse)
async def update_transaction_status(
    trx_id: str,
    payload: TransactionStatusUpdate,
    db: AsyncSession = Depends(get_async_db),
    admin: User = Depends(get_current_admin)
):
    stmt = (
        select(Transaction)
        .where((Transaction.id == trx_id) | (Transaction.transaction_id == trx_id) | (Transaction.order_id == trx_id))
        .options(selectinload(Transaction.memo))
    )
    res = await db.execute(stmt)
    trx = res.scalar_one_or_none()
    if not trx:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    trx.status = payload.status

    # If verified, activate subscription automatically!
    if payload.status == TransactionStatus.VERIFIED and trx.product_id:
        # Check existing subscription
        sub_stmt = select(Subscription).where(
            Subscription.user_id == trx.user_id,
            Subscription.product_id == trx.product_id,
            Subscription.status == SubscriptionStatus.ACTIVE
        )
        sub_res = await db.execute(sub_stmt)
        existing_sub = sub_res.scalar_one_or_none()

        creds = payload.access_credentials or (
            f"Portal Login: https://cloud.softmart.it\n"
            f"Access Key: SM-KEY-{uuid.uuid4().hex[:12].upper()}\n"
            f"Auto-Refreshed Cookies Included."
        )

        now = datetime.utcnow()
        if existing_sub:
            existing_sub.end_date = existing_sub.end_date + timedelta(days=30)
            existing_sub.access_credentials = creds
        else:
            new_sub = Subscription(
                user_id=trx.user_id,
                product_id=trx.product_id,
                start_date=now,
                end_date=now + timedelta(days=30),
                status=SubscriptionStatus.ACTIVE,
                access_credentials=creds
            )
            db.add(new_sub)

    await db.commit()
    await db.refresh(trx)
    resp = TransactionResponse.model_validate(trx)
    return resp

@router.get("/my-subscriptions", response_model=List[SubscriptionResponse])
async def get_my_subscriptions(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    stmt = (
        select(Subscription)
        .where(Subscription.user_id == current_user.id)
        .order_by(Subscription.end_date.desc())
    )
    res = await db.execute(stmt)
    subs = res.scalars().all()

    now = datetime.utcnow()
    output = []
    for s in subs:
        p_res = await db.execute(select(Product.title).where(Product.id == s.product_id))
        title = p_res.scalar_one_or_none()
        days_left = max(0, (s.end_date - now).days)
        s_resp = SubscriptionResponse.model_validate(s)
        s_resp.product_title = title
        s_resp.days_remaining = days_left
        output.append(s_resp)
    return output
