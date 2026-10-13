import uuid
from datetime import datetime

from app.core.config import settings
from app.core.database import get_async_db
from app.models.entities import MemoType
from app.schemas.all_schemas import GenerateMemoRequest, TransactionMemoResponse
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/memos", tags=["Dutch-Bangla Bank & NexusPay Memos"])


@router.get("/{transaction_id}")
async def get_memo_by_transaction_id(
    transaction_id: str, db: AsyncIOMotorDatabase = Depends(get_async_db)  # noqa: B008
):
    trx = await db["transactions"].find_one(
        {
            "$or": [
                {"id": transaction_id},
                {"transaction_id": transaction_id},
                {"order_id": transaction_id},
            ]
        }
    )

    if trx:
        memo = await db["transaction_memos"].find_one({"transaction_id": trx["id"]})
        if memo:
            return {
                "transaction": {
                    "id": trx["id"],
                    "order_id": trx["order_id"],
                    "transaction_id": trx["transaction_id"],
                    "amount_bdt": trx["amount_bdt"],
                    "payment_method": trx["payment_method"],
                    "status": trx["status"],
                    "created_at": trx["created_at"],
                },
                "memo": TransactionMemoResponse(
                    id=memo["id"],
                    transaction_id=memo["transaction_id"],
                    memo_type=MemoType(
                        memo.get("memo_type", MemoType.FUND_TRANSFER.value)
                    ),
                    receiver_name=memo.get("receiver_name"),
                    receiver_bank=memo.get("receiver_bank"),
                    receiver_account=memo.get("receiver_account"),
                    sender_card_type=memo.get("sender_card_type"),
                    sender_card_number=memo.get("sender_card_number"),
                    nexus_pay_id=memo.get("nexus_pay_id"),
                    biller_name=memo.get("biller_name"),
                    biller_code=memo.get("biller_code"),
                    student_id=memo.get("student_id"),
                    paid_from_channel=memo.get("paid_from_channel"),
                    fee_bdt=float(memo.get("fee_bdt", 0.0)),
                    formatted_timestamp=memo.get("formatted_timestamp"),
                    raw_reference=memo.get("raw_reference"),
                ),
            }

    now_str = datetime.now().strftime("%d-%b-%Y %I:%M:%S %p")
    return {
        "transaction": {
            "order_id": f"PREVIEW-{uuid.uuid4().hex[:6].upper()}",
            "transaction_id": transaction_id,
            "amount_bdt": 599.00,
            "payment_method": "NEXUSPAY_DBBL",
            "status": "VERIFIED",
        },
        "memo": {
            "id": str(uuid.uuid4()),
            "transaction_id": transaction_id,
            "memo_type": MemoType.FUND_TRANSFER,
            "receiver_name": settings.DBBL_RECEIVER_NAME,
            "receiver_bank": settings.DBBL_RECEIVER_BANK,
            "receiver_account": settings.DBBL_RECEIVER_ACCOUNT,
            "sender_card_type": "NEXUS DEBIT",
            "sender_card_number": "9011-XXXX-XXXX-4581",
            "nexus_pay_id": "NX-882941",
            "biller_name": "East West University",
            "biller_code": "DBBL-EDU-8810",
            "student_id": "2022-1-60-019",
            "paid_from_channel": "NEXUS DEBIT",
            "fee_bdt": 0.00,
            "formatted_timestamp": now_str,
            "raw_reference": transaction_id,
        },
    }


@router.post("/generate")
async def generate_memo_manually(payload: GenerateMemoRequest):
    now_str = datetime.now().strftime("%d-%b-%Y %I:%M:%S %p")
    return {
        "status": "SUCCESS",
        "memo": {
            "transaction_id": payload.transaction_id,
            "memo_type": payload.memo_type,
            "amount_bdt": payload.amount_bdt,
            "receiver_name": payload.receiver_name or settings.DBBL_RECEIVER_NAME,
            "receiver_bank": settings.DBBL_RECEIVER_BANK,
            "receiver_account": payload.receiver_account
            or settings.DBBL_RECEIVER_ACCOUNT,
            "sender_card_type": payload.sender_card_type or "NEXUS DEBIT",
            "sender_card_number": payload.sender_card_number or "9011-XXXX-XXXX-4581",
            "nexus_pay_id": payload.nexus_pay_id or "NX-882941",
            "biller_name": payload.biller_name or "East West University",
            "biller_code": payload.biller_code or "DBBL-EDU-8810",
            "student_id": payload.student_id or "2022-1-60-019",
            "paid_from_channel": payload.paid_from_channel or "NEXUS DEBIT",
            "fee_bdt": 0.00,
            "formatted_timestamp": now_str,
        },
    }
