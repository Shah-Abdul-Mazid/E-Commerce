import re
import uuid
from datetime import datetime, timedelta
from typing import List, Optional  # noqa: F401, UP035
from pydantic import BaseModel

from app.core.config import settings
from app.core.database import get_async_db
from app.core.deps import get_current_admin, get_current_user
from app.models.entities import (
    MemoType,
    PaymentMethod,
    ProductType,
    SubscriptionStatus,
    TransactionStatus,
)
from app.schemas.all_schemas import (
    CheckoutSubmit,
    SubscriptionResponse,
    TransactionMemoResponse,
    TransactionResponse,
    TransactionStatusUpdate,
    UserResponse,
)
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/checkout", tags=["Checkout & Subscriptions"])


def _doc_to_memo_response(
    memo_doc: dict | None,
) -> TransactionMemoResponse | None:
    if not memo_doc:
        return None
    return TransactionMemoResponse(
        id=memo_doc["id"],
        transaction_id=memo_doc["transaction_id"],
        memo_type=MemoType(memo_doc.get("memo_type", MemoType.FUND_TRANSFER.value)),
        receiver_name=memo_doc.get("receiver_name"),
        receiver_bank=memo_doc.get("receiver_bank"),
        receiver_account=memo_doc.get("receiver_account"),
        sender_card_type=memo_doc.get("sender_card_type"),
        sender_card_number=memo_doc.get("sender_card_number"),
        nexus_pay_id=memo_doc.get("nexus_pay_id"),
        biller_name=memo_doc.get("biller_name"),
        biller_code=memo_doc.get("biller_code"),
        student_id=memo_doc.get("student_id"),
        paid_from_channel=memo_doc.get("paid_from_channel"),
        fee_bdt=float(memo_doc.get("fee_bdt", 0.0)),
        formatted_timestamp=memo_doc.get("formatted_timestamp"),
        raw_reference=memo_doc.get("raw_reference"),
    )


async def _build_transaction_response(
    db: AsyncIOMotorDatabase,
    trx_doc: dict,
    product_title_override: str | None = None,
) -> TransactionResponse:
    memo_doc = await db["transaction_memos"].find_one({"transaction_id": trx_doc["id"]})
    product_title = product_title_override or trx_doc.get("product_title")
    if not product_title and trx_doc.get("product_id"):
        prod = await db["products"].find_one({"id": trx_doc["product_id"]})
        if prod:
            product_title = prod.get("title")

    # Fetch user email and customer name so admin and user see who purchased
    user_email = trx_doc.get("customer_email") or trx_doc.get("user_email")
    customer_name = trx_doc.get("customer_name")
    if (not user_email or not customer_name) and trx_doc.get("user_id"):
        user = await db["users"].find_one({"id": trx_doc["user_id"]})
        if user:
            user_email = user_email or user.get("email")
            customer_name = customer_name or user.get("full_name")

    return TransactionResponse(
        id=trx_doc["id"],
        order_id=trx_doc["order_id"],
        user_id=trx_doc.get("user_id") or "",
        product_id=trx_doc.get("product_id"),
        product_title=product_title,
        amount_bdt=float(trx_doc.get("amount_bdt", 0.0)),
        payment_method=PaymentMethod(trx_doc.get("payment_method", PaymentMethod.SSLCOMMERZ.value)),
        transaction_id=trx_doc["transaction_id"],
        sender_account=trx_doc.get("sender_account"),
        memo_type=MemoType(trx_doc.get("memo_type", MemoType.FUND_TRANSFER.value)),
        status=TransactionStatus(
            trx_doc.get("status", TransactionStatus.VERIFIED.value)
        ),
        created_at=trx_doc.get("created_at", datetime.utcnow()),  # noqa: DTZ003
        memo=_doc_to_memo_response(memo_doc),
        user_email=user_email,
        customer_name=customer_name,
    )


@router.post("/submit", response_model=TransactionResponse)
async def submit_checkout(
    payload: CheckoutSubmit,
    db: AsyncIOMotorDatabase = Depends(get_async_db),  # noqa: B008
    current_user: UserResponse = Depends(get_current_user),  # noqa: B008
):
    # 1. Fetch or Match Product in MongoDB
    product = await db["products"].find_one({"id": payload.product_id})

    if not product and payload.product_title:
        escaped_title = re.escape(payload.product_title.strip())
        product = await db["products"].find_one(
            {"title": {"$regex": escaped_title, "$options": "i"}}
        )

    if not product:
        for keyword in [
            "Quillbot",
            "ChatGPT",
            "Grammarly",
            "Stealth",
            "Coursera",
            "Standard",
            "Premium",
            "Advance",
        ]:
            if keyword.lower() in payload.product_id.lower() or (
                payload.product_title
                and keyword.lower() in payload.product_title.lower()
            ):
                product = await db["products"].find_one(
                    {"title": {"$regex": keyword, "$options": "i"}}
                )
                if product:
                    break

    if not product:
        product = {
            "id": payload.product_id,
            "title": payload.product_title
            or payload.product_id.replace("-", " ").title(),
            "badge": None,
            "description": "Verified digital tool & academic license",
            "product_type": (
                ProductType.PACKAGE.value
                if (
                    "bundle" in payload.product_id.lower()
                    or "pkg" in payload.product_id.lower()
                )
                else ProductType.SINGLE_TOOL.value
            ),
            "price_bdt": float(payload.price_bdt or 200.00),
            "features": [
                "Instant AI VIP Access",
                "24/7 Dedicated Server License",
                "Academic Verified",
            ],
            "icon_name": "Zap",
            "is_active": True,
            "created_at": datetime.utcnow(),  # noqa: DTZ003
        }
        await db["products"].insert_one(product)

    order_id = f"EZ-{uuid.uuid4().hex[:8].upper()}"
    now_str = datetime.now().strftime("%d-%b-%Y %I:%M:%S %p")
    now_utc = datetime.utcnow()  # noqa: DTZ003
    trx_uuid = str(uuid.uuid4())

    # 2. Record Transaction under the login user
    trx_doc = {
        "id": trx_uuid,
        "order_id": order_id,
        "user_id": current_user.id,
        "product_id": product["id"],
        "product_title": product["title"],
        "amount_bdt": float(payload.price_bdt or product["price_bdt"]),
        "payment_method": payload.payment_method.value,
        "transaction_id": payload.transaction_id.strip(),
        "sender_account": payload.sender_account,
        "memo_type": payload.memo_type.value,
        "status": TransactionStatus.VERIFIED.value,
        "created_at": now_utc,
    }
    await db["transactions"].insert_one(trx_doc)

    # 3. Generate corresponding DBBL / NexusPay Transaction Memo
    sender_card = (
        f"9011-XXXX-XXXX-{payload.sender_account[-4:]}"
        if payload.sender_account and len(payload.sender_account) >= 4
        else "9011-XXXX-XXXX-4581"
    )
    memo_doc = {
        "id": str(uuid.uuid4()),
        "transaction_id": trx_uuid,
        "memo_type": payload.memo_type.value,
        "receiver_name": settings.DBBL_RECEIVER_NAME,
        "receiver_bank": settings.DBBL_RECEIVER_BANK,
        "receiver_account": settings.DBBL_RECEIVER_ACCOUNT,
        "sender_card_type": "NEXUS DEBIT",
        "sender_card_number": sender_card,
        "nexus_pay_id": payload.nexus_pay_id or f"NX-{uuid.uuid4().hex[:6].upper()}",
        "biller_name": payload.biller_name or product["title"],
        "biller_code": "DBBL-EDU-8810",
        "student_id": payload.student_id or f"STU-{uuid.uuid4().hex[:8].upper()}",
        "paid_from_channel": payload.payment_method.value,
        "fee_bdt": 0.00,
        "formatted_timestamp": now_str,
        "raw_reference": order_id,
    }
    await db["transaction_memos"].insert_one(memo_doc)

    # 4. Activate paid subscription under the logged-in user
    existing_sub = await db["subscriptions"].find_one(
        {
            "user_id": current_user.id,
            "product_id": product["id"],
            "status": SubscriptionStatus.ACTIVE.value,
        }
    )

    creds = (
        f"Product: {product['title']}\n"
        f"Provider: EZOPY MART TECH\n"
        f"License Token: EZ-VIP-{uuid.uuid4().hex[:10].upper()}\n"
        f"Authorized User: {current_user.email}\n"
        f"Access Status: ACTIVE • Direct Cloud & Extension Sync"
    )

    if existing_sub:
        current_end = existing_sub.get("end_date", now_utc)
        new_end = current_end + timedelta(days=30)
        await db["subscriptions"].update_one(
            {"id": existing_sub["id"]},
            {"$set": {"end_date": new_end, "access_credentials": creds}},
        )
    else:
        sub_doc = {
            "id": str(uuid.uuid4()),
            "user_id": current_user.id,
            "product_id": product["id"],
            "product_title": product["title"],
            "start_date": now_utc,
            "end_date": now_utc + timedelta(days=30),
            "status": SubscriptionStatus.ACTIVE.value,
            "access_credentials": creds,
        }
        await db["subscriptions"].insert_one(sub_doc)

    return await _build_transaction_response(db, trx_doc, product["title"])


class SyncSSLOrderRequest(BaseModel):
    transaction_id: str
    amount: Optional[float] = None
    product_title: Optional[str] = None
    product_id: Optional[str] = None


@router.post("/sync-ssl-order", response_model=TransactionResponse)
async def sync_ssl_order(
    payload: SyncSSLOrderRequest,
    db: AsyncIOMotorDatabase = Depends(get_async_db),  # noqa: B008
    current_user: UserResponse = Depends(get_current_user),  # noqa: B008
):
    tran_id = payload.transaction_id.strip()
    now_utc = datetime.utcnow()  # noqa: DTZ003

    product = None
    if payload.product_id:
        product = await db["products"].find_one({"id": payload.product_id})
    if not product and payload.product_title:
        escaped_title = re.escape(payload.product_title.strip())
        product = await db["products"].find_one({"title": {"$regex": escaped_title, "$options": "i"}})
    if not product and payload.amount:
        product = await db["products"].find_one({"price_bdt": payload.amount})
    if not product:
        product = await db["products"].find_one({"title": {"$regex": "Premium", "$options": "i"}})

    prod_id = (product["id"] if product else payload.product_id) or "5406c043-cb0a-41e8-b7a9-8e537e3b1ea0"
    prod_title = (product["title"] if product else payload.product_title) or "Premium Package"
    amount = float(payload.amount or (product["price_bdt"] if product else 599.0))

    trx_doc = await db["transactions"].find_one({"transaction_id": tran_id})
    if trx_doc:
        trx_uuid = trx_doc["id"]
        order_id = trx_doc.get("order_id") or f"EZ-{uuid.uuid4().hex[:8].upper()}"
        await db["transactions"].update_one(
            {"_id": trx_doc["_id"]},
            {
                "$set": {
                    "user_id": current_user.id,
                    "customer_email": current_user.email.strip().lower(),
                    "customer_name": current_user.full_name,
                    "product_id": prod_id,
                    "product_title": prod_title,
                    "status": TransactionStatus.VERIFIED.value,
                    "updated_at": now_utc,
                }
            },
        )
        trx_doc = await db["transactions"].find_one({"id": trx_uuid})
    else:
        trx_uuid = str(uuid.uuid4())
        order_id = f"EZ-{uuid.uuid4().hex[:8].upper()}"
        trx_doc = {
            "id": trx_uuid,
            "order_id": order_id,
            "user_id": current_user.id,
            "customer_email": current_user.email.strip().lower(),
            "customer_name": current_user.full_name,
            "product_id": prod_id,
            "product_title": prod_title,
            "amount_bdt": amount,
            "payment_method": PaymentMethod.SSLCOMMERZ.value,
            "transaction_id": tran_id,
            "sender_account": "SSLCOMMERZ",
            "memo_type": MemoType.BILL_PAYMENT.value,
            "status": TransactionStatus.VERIFIED.value,
            "created_at": now_utc,
        }
        await db["transactions"].insert_one(trx_doc)

    # Ensure Memo exists
    existing_memo = await db["transaction_memos"].find_one({"transaction_id": trx_uuid})
    if not existing_memo:
        memo_doc = {
            "id": str(uuid.uuid4()),
            "transaction_id": trx_uuid,
            "memo_type": MemoType.BILL_PAYMENT.value,
            "receiver_name": settings.DBBL_RECEIVER_NAME,
            "receiver_bank": settings.DBBL_RECEIVER_BANK,
            "receiver_account": settings.DBBL_RECEIVER_ACCOUNT,
            "sender_card_type": "SSLCOMMERZ GATEWAY",
            "sender_card_number": "9011-XXXX-XXXX-4581",
            "nexus_pay_id": f"NX-{tran_id[-6:]}",
            "biller_name": prod_title,
            "biller_code": "DBBL-EDU-8810",
            "student_id": "2022-1-60-019",
            "paid_from_channel": "SSLCOMMERZ",
            "fee_bdt": 0.00,
            "formatted_timestamp": datetime.now().strftime("%d-%b-%Y %I:%M:%S %p"),
            "raw_reference": order_id,
        }
        await db["transaction_memos"].insert_one(memo_doc)

    # Ensure Subscription exists & is active
    creds = (
        f"Product: {prod_title}\n"
        f"Provider: EZOPY MART TECH\n"
        f"License Token: EZ-VIP-{uuid.uuid4().hex[:10].upper()}\n"
        f"Authorized User: {current_user.email}\n"
        f"Access Status: ACTIVE • Direct Cloud & Extension Sync"
    )
    existing_sub = await db["subscriptions"].find_one({
        "user_id": current_user.id,
        "product_id": prod_id,
        "status": SubscriptionStatus.ACTIVE.value,
    })
    if existing_sub:
        new_end = existing_sub.get("end_date", now_utc) + timedelta(days=30)
        await db["subscriptions"].update_one(
            {"id": existing_sub["id"]},
            {"$set": {"end_date": new_end, "access_credentials": creds, "status": SubscriptionStatus.ACTIVE.value}},
        )
    else:
        sub_doc = {
            "id": str(uuid.uuid4()),
            "user_id": current_user.id,
            "customer_email": current_user.email.strip().lower(),
            "product_id": prod_id,
            "product_title": prod_title,
            "start_date": now_utc,
            "end_date": now_utc + timedelta(days=30),
            "status": SubscriptionStatus.ACTIVE.value,
            "access_credentials": creds,
        }
        await db["subscriptions"].insert_one(sub_doc)

    return await _build_transaction_response(db, trx_doc, prod_title)


@router.get("/my-history", response_model=list[TransactionResponse])
async def get_my_transactions(
    db: AsyncIOMotorDatabase = Depends(get_async_db),  # noqa: B008
    current_user: UserResponse = Depends(get_current_user),  # noqa: B008
):
    user_email = current_user.email.strip().lower()
    cursor = (
        db["transactions"].find({
            "$or": [
                {"user_id": current_user.id},
                {"customer_email": user_email},
            ]
        }).sort("created_at", -1)
    )
    docs = await cursor.to_list(length=500)
    output = []
    for d in docs:
        output.append(await _build_transaction_response(db, d))
    return output


@router.get("/all-transactions", response_model=list[TransactionResponse])
async def get_all_transactions(
    db: AsyncIOMotorDatabase = Depends(get_async_db),  # noqa: B008
    admin: UserResponse = Depends(get_current_admin),  # noqa: B008
):
    cursor = db["transactions"].find({}).sort("created_at", -1)
    docs = await cursor.to_list(length=1000)
    output = []
    for d in docs:
        output.append(await _build_transaction_response(db, d))
    return output


@router.patch("/status/{trx_id}", response_model=TransactionResponse)
async def update_transaction_status(
    trx_id: str,
    payload: TransactionStatusUpdate,
    db: AsyncIOMotorDatabase = Depends(get_async_db),  # noqa: B008
    admin: UserResponse = Depends(get_current_admin),  # noqa: B008
):
    trx_doc = await db["transactions"].find_one(
        {
            "$or": [
                {"id": trx_id},
                {"transaction_id": trx_id},
                {"order_id": trx_id},
            ]
        }
    )
    if not trx_doc:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    await db["transactions"].update_one(
        {"id": trx_doc["id"]}, {"$set": {"status": payload.status.value}}
    )
    trx_doc["status"] = payload.status.value

    if payload.status == TransactionStatus.VERIFIED and trx_doc.get("product_id"):
        existing_sub = await db["subscriptions"].find_one(
            {
                "user_id": trx_doc["user_id"],
                "product_id": trx_doc["product_id"],
                "status": SubscriptionStatus.ACTIVE.value,
            }
        )
        creds = payload.access_credentials or (
            f"Provider: EZOPY MART TECH\n"
            f"Access Key: EZ-KEY-{uuid.uuid4().hex[:12].upper()}\n"
            f"Auto-Refreshed Cookies Included."
        )
        now = datetime.utcnow()  # noqa: DTZ003
        if existing_sub:
            new_end = existing_sub.get("end_date", now) + timedelta(days=30)
            await db["subscriptions"].update_one(
                {"id": existing_sub["id"]},
                {"$set": {"end_date": new_end, "access_credentials": creds}},
            )
        else:
            await db["subscriptions"].insert_one(
                {
                    "id": str(uuid.uuid4()),
                    "user_id": trx_doc["user_id"],
                    "product_id": trx_doc["product_id"],
                    "start_date": now,
                    "end_date": now + timedelta(days=30),
                    "status": SubscriptionStatus.ACTIVE.value,
                    "access_credentials": creds,
                }
            )

    return await _build_transaction_response(db, trx_doc)


@router.get("/my-subscriptions", response_model=list[SubscriptionResponse])
async def get_my_subscriptions(
    db: AsyncIOMotorDatabase = Depends(get_async_db),  # noqa: B008
    current_user: UserResponse = Depends(get_current_user),  # noqa: B008
):
    user_email = current_user.email.strip().lower()
    cursor = db["subscriptions"].find({
        "$or": [
            {"user_id": current_user.id},
            {"customer_email": user_email},
        ]
    }).sort("end_date", -1)
    subs = await cursor.to_list(length=500)

    now = datetime.utcnow()  # noqa: DTZ003
    output = []
    for s in subs:
        title = s.get("product_title")
        if not title and s.get("product_id"):
            prod = await db["products"].find_one({"id": s["product_id"]})
            if prod:
                title = prod.get("title")
        end_date = s.get("end_date", now)
        days_left = max(0, (end_date - now).days)
        output.append(
            SubscriptionResponse(
                id=s["id"],
                product_id=s["product_id"],
                product_title=title or "Active Tool",
                start_date=s.get("start_date", now),
                end_date=end_date,
                status=SubscriptionStatus(
                    s.get("status", SubscriptionStatus.ACTIVE.value)
                ),
                access_credentials=s.get("access_credentials"),
                days_remaining=days_left,
            )
        )
    return output

