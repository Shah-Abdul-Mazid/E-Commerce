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
    TransactionStatus, SubscriptionStatus, MemoType, ProductType
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
    # 1. Fetch or Match Product
    product = None
    result = await db.execute(select(Product).where(Product.id == payload.product_id))
    product = result.scalar_one_or_none()

    if not product and payload.product_title:
        res_t = await db.execute(
            select(Product).where(Product.title.ilike(f"%{payload.product_title.strip()}%"))
        )
        product = res_t.scalars().first()

    if not product:
        # Check by known tool / course keywords
        for keyword in ["Quillbot", "ChatGPT", "Grammarly", "Stealth", "Coursera", "Standard", "Premium", "Advance"]:
            if keyword.lower() in payload.product_id.lower() or (payload.product_title and keyword.lower() in payload.product_title.lower()):
                res_k = await db.execute(select(Product).where(Product.title.ilike(f"%{keyword}%")))
                product = res_k.scalars().first()
                if product:
                    break

    if not product:
        # Auto-create product record if not yet in database
        product = Product(
            id=payload.product_id,
            title=payload.product_title or payload.product_id.replace('-', ' ').title(),
            product_type=ProductType.PACKAGE if ('bundle' in payload.product_id.lower() or 'pkg' in payload.product_id.lower()) else ProductType.SINGLE_TOOL,
            price_bdt=payload.price_bdt or 200.00,
            features=["Instant AI VIP Access", "24/7 Dedicated Server License", "Academic Verified"],
            icon_name="Zap",
            is_active=True
        )
        db.add(product)
        await db.flush()

    order_id = f"SM-{uuid.uuid4().hex[:8].upper()}"
    now_str = datetime.now().strftime("%d-%b-%Y %I:%M:%S %p")
    now_utc = datetime.utcnow()

    # 2. Record Transaction under the login user
    trx = Transaction(
        order_id=order_id,
        user_id=current_user.id,
        product_id=product.id,
        amount_bdt=payload.price_bdt or product.price_bdt,
        payment_method=payload.payment_method,
        transaction_id=payload.transaction_id.strip(),
        sender_account=payload.sender_account,
        memo_type=payload.memo_type,
        status=TransactionStatus.VERIFIED,  # Immediately verified on success
    )
    db.add(trx)
    await db.flush()

    # 3. Generate corresponding DBBL / NexusPay Transaction Memo
    sender_card = f"9011-XXXX-XXXX-{payload.sender_account[-4:] if payload.sender_account and len(payload.sender_account) >= 4 else '4581'}"
    memo = TransactionMemo(
        transaction_id=trx.id,
        memo_type=payload.memo_type,
        receiver_name=settings.DBBL_RECEIVER_NAME,
        receiver_bank=settings.DBBL_RECEIVER_BANK,
        receiver_account=settings.DBBL_RECEIVER_ACCOUNT,
        sender_card_type="NEXUS DEBIT",
        sender_card_number=sender_card,
        nexus_pay_id=payload.nexus_pay_id or f"NX-{uuid.uuid4().hex[:6].upper()}",
        biller_name=payload.biller_name or product.title,
        biller_code="DBBL-EDU-8810",
        student_id=payload.student_id or f"STU-{uuid.uuid4().hex[:8].upper()}",
        paid_from_channel=payload.payment_method.value,
        fee_bdt=0.00,
        formatted_timestamp=now_str,
        raw_reference=order_id,
    )
    db.add(memo)

    # 4. IMMEDIATELY ACTIVATE PAID SUBSCRIPTION UNDER LOGIN USER ONLY!
    sub_stmt = select(Subscription).where(
        Subscription.user_id == current_user.id,
        Subscription.product_id == product.id,
        Subscription.status == SubscriptionStatus.ACTIVE
    )
    sub_res = await db.execute(sub_stmt)
    existing_sub = sub_res.scalar_one_or_none()

    creds = (
        f"Product: {product.title}\n"
        f"Web Portal: https://cloud.samjap.mart\n"
        f"License Token: SJ-VIP-{uuid.uuid4().hex[:10].upper()}\n"
        f"Authorized User: {current_user.email}\n"
        f"Access Status: ACTIVE • Direct Cloud & Extension Sync"
    )

    if existing_sub:
        existing_sub.end_date = existing_sub.end_date + timedelta(days=30)
        existing_sub.access_credentials = creds
    else:
        new_sub = Subscription(
            user_id=current_user.id,
            product_id=product.id,
            start_date=now_utc,
            end_date=now_utc + timedelta(days=30),
            status=SubscriptionStatus.ACTIVE,
            access_credentials=creds
        )
        db.add(new_sub)

    await db.commit()

    # Load transaction with memo relationship
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
        sub_stmt = select(Subscription).where(
            Subscription.user_id == trx.user_id,
            Subscription.product_id == trx.product_id,
            Subscription.status == SubscriptionStatus.ACTIVE
        )
        sub_res = await db.execute(sub_stmt)
        existing_sub = sub_res.scalar_one_or_none()

        creds = payload.access_credentials or (
            f"Portal Login: https://cloud.samjap.mart\n"
            f"Access Key: SJ-KEY-{uuid.uuid4().hex[:12].upper()}\n"
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
        s_resp.product_title = title or "Active Tool"
        s_resp.days_remaining = days_left
        output.append(s_resp)
    return output
