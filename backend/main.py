import os
import sys
import uuid
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure backend directory is in sys.path for Vercel serverless runtime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from sslcommerz_lib import SSLCOMMERZ
except ImportError:
    SSLCOMMERZ = None

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables (local dev)
load_dotenv()
# Also load from root .env for Vercel monorepo layout
_root_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
if os.path.exists(_root_env):
    load_dotenv(_root_env, override=False)

APP_BASE_URL = os.getenv("APP_BASE_URL", "").rstrip("/")
FRONTEND_URL = os.getenv("FRONTEND_URL", "").rstrip("/")


def _get_ssl_client(store_id_override: Optional[str] = None, store_pass_override: Optional[str] = None):
    """Return a fresh SSLCOMMERZ client using env-vars resolved at call time (Vercel-safe)."""
    is_live = os.getenv("SSL_IS_LIVE", "false").strip().lower() in ("true", "1", "yes")
    is_sandbox = not is_live

    store_id = store_id_override or (
        os.getenv("SSL_STORE_ID")
        or os.getenv("SSL_COMMERZ_STORE_ID")
        or ""
    ).strip()
    store_pass = store_pass_override or (
        os.getenv("SSL_STORE_PASSWORD")
        or os.getenv("SSL_COMMERZ_STORE_PASS")
        or ""
    ).strip()

    # In sandbox mode, replace known deactivated store IDs with active sandbox credentials
    if is_sandbox:
        if not store_id or store_id == "samja69dc1417ce5a9":
            store_id = "jfpet6acc0a12e3919"
            store_pass = "jfpet6acc0a12e3919@ssl"

    if not (SSLCOMMERZ and store_id and store_pass):
        return None, store_id, store_pass, is_sandbox
    client = SSLCOMMERZ({"store_id": store_id, "store_pass": store_pass, "issandbox": is_sandbox})
    return client, store_id, store_pass, is_sandbox


def _resolve_origin(request: Request, configured_url: str) -> str:
    url = configured_url or os.getenv("APP_BASE_URL", "").rstrip("/")
    if url:
        return url.rstrip("/")
    vercel_url = os.getenv("VERCEL_PROJECT_PRODUCTION_URL") or os.getenv("VERCEL_URL")
    if vercel_url:
        return f"https://{vercel_url.rstrip('/')}"
    return str(request.base_url).rstrip("/")


# In-memory transaction and order store (for demo / state persistence)
orders_db: Dict[str, Dict[str, Any]] = {}

app = FastAPI(
    title="EZOPY MART TECH",
    description="Full-stack AI Tools Marketplace & SSLCommerz / NexusPay Gateway (MongoDB Atlas)",
    version="2.0.0"
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# ==========================================
# Global exception handlers — ALWAYS return JSON
# ==========================================

@app.exception_handler(StarletteHTTPException)
async def _http_exc_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail or "An error occurred"},
    )


@app.exception_handler(RequestValidationError)
async def _validation_exc_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )


@app.exception_handler(Exception)
async def _generic_exc_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception on %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."},
    )

# Import and mount EZOPY MART TECH routers & MongoDB Atlas seeding
from app.api.v1.auth import router as auth_router
from app.api.v1.products import router as products_router
from app.api.v1.checkout import router as checkout_router
from app.api.v1.memos import router as memos_router
from app.core.config import settings as app_settings
from app.main import ensure_db_initialized

app.include_router(auth_router, prefix=app_settings.API_V1_STR)
app.include_router(products_router, prefix=app_settings.API_V1_STR)
app.include_router(checkout_router, prefix=app_settings.API_V1_STR)
app.include_router(memos_router, prefix=app_settings.API_V1_STR)


@app.on_event("startup")
async def on_startup():
    await ensure_db_initialized()


@app.middleware("http")
async def db_init_middleware(request: Request, call_next):
    await ensure_db_initialized()
    return await call_next(request)


# ==========================================
# Pydantic Request Models
# ==========================================
class CustomerInfo(BaseModel):
    name: str = "Test Customer"
    email: str = "customer@example.com"
    phone: str = "01700000000"
    address: str = "Dhaka, Bangladesh"
    city: str = "Dhaka"
    country: str = "Bangladesh"


class PaymentInitRequest(BaseModel):
    amount: float = Field(default=100.26, gt=0, description="Order total in BDT")
    product_name: str = Field(default="Premium Wireless Headphones", description="Name of the item")
    product_id: Optional[str] = Field(default=None, description="Product ID")
    product_category: str = Field(default="Electronics", description="Product category")
    customer: Optional[CustomerInfo] = Field(default_factory=CustomerInfo)
    tran_id: Optional[str] = Field(default=None, description="Optional custom transaction ID")
    user_id: Optional[str] = Field(default=None, description="User ID if available")


class RefundRequest(BaseModel):
    bank_tran_id: str = Field(..., description="The transaction ID at Bank end")
    refund_amount: float = Field(..., gt=0, description="Amount to refund")
    refund_remarks: str = Field(..., description="Reason for refund")


# ==========================================
# MongoDB SSLCommerz Order Fulfillment Helper
# ==========================================

async def _fulfill_ssl_order(payload: dict, val_id: str, tran_id: str, amount_val: float = None):
    """Save verified SSLCommerz transaction, memo, and active subscription into MongoDB Atlas."""
    try:
        from app.core.database import get_database
        db = get_database()
        now_utc = datetime.utcnow()
        amount = float(amount_val or payload.get("amount") or 599.0)
        card_type = payload.get("card_type") or "SSL-CARD"
        bank_tran_id = payload.get("bank_tran_id") or ""

        existing_trx = await db["transactions"].find_one({"transaction_id": tran_id})

        user_id = payload.get("value_a") or (existing_trx.get("user_id") if existing_trx else None)
        customer_email = (
            payload.get("value_c")
            or payload.get("cus_email")
            or (existing_trx.get("customer_email") if existing_trx else None)
            or ""
        ).strip().lower()
        customer_name = payload.get("cus_name") or (existing_trx.get("customer_name") if existing_trx else None) or "Customer"
        customer_phone = payload.get("cus_phone") or (existing_trx.get("customer_phone") if existing_trx else None)

        product_id = payload.get("value_b") or (existing_trx.get("product_id") if existing_trx else None)
        product_title = payload.get("value_d") or (existing_trx.get("product_title") if existing_trx else None)

        if not user_id and customer_email:
            u = await db["users"].find_one({"email": customer_email})
            if u:
                user_id = u["id"]
                customer_name = customer_name or u.get("full_name")

        if not product_id or not product_title:
            p = await db["products"].find_one({"price_bdt": amount})
            if not p:
                p = await db["products"].find_one({"title": {"$regex": "Premium", "$options": "i"}})
            if p:
                product_id = product_id or p["id"]
                product_title = product_title or p["title"]

        product_id = product_id or "5406c043-cb0a-41e8-b7a9-8e537e3b1ea0"
        product_title = product_title or "Premium Package"

        trx_uuid = (existing_trx.get("id") if existing_trx else None) or str(uuid.uuid4())
        order_id = (existing_trx.get("order_id") if existing_trx else None) or f"EZ-{uuid.uuid4().hex[:8].upper()}"

        await db["transactions"].update_one(
            {"transaction_id": tran_id},
            {
                "$set": {
                    "id": trx_uuid,
                    "order_id": order_id,
                    "user_id": user_id or "",
                    "customer_email": customer_email,
                    "customer_name": customer_name,
                    "customer_phone": customer_phone,
                    "product_id": product_id,
                    "product_title": product_title,
                    "amount_bdt": amount,
                    "payment_method": "SSLCOMMERZ",
                    "transaction_id": tran_id,
                    "sender_account": payload.get("card_no") or payload.get("card_issuer") or card_type,
                    "memo_type": "BILL_PAYMENT",
                    "status": "VERIFIED",
                    "val_id": val_id,
                    "bank_tran_id": bank_tran_id,
                    "created_at": (existing_trx.get("created_at") if existing_trx else now_utc),
                    "updated_at": now_utc,
                }
            },
            upsert=True,
        )

        # Memo slip
        await db["transaction_memos"].update_one(
            {"transaction_id": trx_uuid},
            {
                "$set": {
                    "id": str(uuid.uuid4()),
                    "transaction_id": trx_uuid,
                    "memo_type": "BILL_PAYMENT",
                    "receiver_name": "EZOPY MART TECH",
                    "receiver_bank": "Dutch-Bangla Bank PLC",
                    "receiver_account": "107.110.198425",
                    "sender_card_type": card_type,
                    "sender_card_number": payload.get("card_no") or "9011-XXXX-XXXX-4581",
                    "nexus_pay_id": f"NX-{tran_id[-6:]}",
                    "biller_name": product_title,
                    "biller_code": "DBBL-EDU-8810",
                    "student_id": "2022-1-60-019",
                    "paid_from_channel": "SSLCOMMERZ",
                    "fee_bdt": 0.00,
                    "formatted_timestamp": datetime.now().strftime("%d-%b-%Y %I:%M:%S %p"),
                    "raw_reference": order_id,
                }
            },
            upsert=True,
        )

        # Activate subscription
        if user_id or customer_email:
            sub_filter = {"user_id": user_id, "product_id": product_id} if user_id else {"customer_email": customer_email, "product_id": product_id}
            existing_sub = await db["subscriptions"].find_one(sub_filter)
            creds = (
                f"Product: {product_title}\n"
                f"Provider: EZOPY MART TECH\n"
                f"License Token: EZ-VIP-{uuid.uuid4().hex[:10].upper()}\n"
                f"Authorized User: {customer_email}\n"
                f"Access Status: ACTIVE • Direct Cloud & Extension Sync"
            )
            if existing_sub:
                new_end = existing_sub.get("end_date", now_utc) + timedelta(days=30)
                await db["subscriptions"].update_one(
                    {"_id": existing_sub["_id"]},
                    {"$set": {"end_date": new_end, "access_credentials": creds, "status": "ACTIVE"}},
                )
            else:
                sub_doc = {
                    "id": str(uuid.uuid4()),
                    "user_id": user_id or "",
                    "customer_email": customer_email,
                    "product_id": product_id,
                    "product_title": product_title,
                    "start_date": now_utc,
                    "end_date": now_utc + timedelta(days=30),
                    "status": "ACTIVE",
                    "access_credentials": creds,
                }
                await db["subscriptions"].insert_one(sub_doc)
        logger.info(f"SSLCommerz order {tran_id} fulfilled in MongoDB for {customer_email} (User: {user_id})")
    except Exception as e:
        logger.error(f"Error in _fulfill_ssl_order for {tran_id}: {str(e)}", exc_info=True)


# ==========================================
# API Routes
# ==========================================

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "SSLCommerz Payment Gateway Backend",
        "store_id": STORE_ID,
        "is_sandbox": IS_SANDBOX,
        "docs_url": "/docs"
    }


@app.post("/api/init-payment")
async def init_payment(request: Request, payload: PaymentInitRequest):
    """
    1. Initialize payment session with SSLCommerz.
    Returns the GatewayPageURL for frontend redirect.
    """
    # Resolve SSL client lazily so Vercel env-vars are available at request time
    sslcz_client, store_id, store_pass, is_sandbox = _get_ssl_client()

    if not sslcz_client:
        logger.error(
            "SSLCommerz not initialised — missing SSL_STORE_ID or SSL_STORE_PASSWORD. "
            "store_id=%r store_pass_set=%s", store_id, bool(store_pass)
        )
        return JSONResponse(
            status_code=503,
            content={
                "status": "FAILED",
                "message": "Payment gateway is not configured. Please contact support.",
                "reason": "SSL credentials missing from server environment.",
            },
        )

    tran_id = payload.tran_id or f"TXN-{uuid.uuid4().hex[:12].upper()}"
    cust = payload.customer or CustomerInfo()
    # Resolve APP_BASE_URL lazily at request time (Vercel-safe)
    app_origin = _resolve_origin(request, os.getenv("APP_BASE_URL", "").rstrip("/"))

    user_id = payload.user_id
    if not user_id:
        auth_hdr = request.headers.get("authorization", "")
        if auth_hdr.startswith("Bearer "):
            try:
                from app.core.security import decode_access_token
                user_id = decode_access_token(auth_hdr.split(" ", 1)[1])
            except Exception:
                pass

    from app.core.database import get_database
    db = get_database()
    customer_email = cust.email.strip().lower() if cust.email else ""
    if not user_id and customer_email:
        u = await db["users"].find_one({"email": customer_email})
        if u:
            user_id = u["id"]

    # Initial order persistence in MongoDB Atlas
    order_id = f"EZ-{uuid.uuid4().hex[:8].upper()}"
    now_utc = datetime.utcnow()
    trx_uuid = str(uuid.uuid4())
    trx_init_doc = {
        "id": trx_uuid,
        "order_id": order_id,
        "user_id": user_id or "",
        "customer_email": customer_email,
        "customer_name": cust.name,
        "customer_phone": cust.phone,
        "product_id": payload.product_id,
        "product_title": payload.product_name,
        "amount_bdt": round(payload.amount, 2),
        "payment_method": "SSLCOMMERZ",
        "transaction_id": tran_id,
        "sender_account": cust.phone or "SSLCOMMERZ",
        "memo_type": "BILL_PAYMENT",
        "status": "PENDING",
        "created_at": now_utc,
    }
    await db["transactions"].update_one(
        {"transaction_id": tran_id},
        {"$set": trx_init_doc},
        upsert=True,
    )

    # Define callback URLs routed back to this FastAPI server
    post_body = {
        "total_amount": round(payload.amount, 2),
        "currency": "BDT",
        "tran_id": tran_id,
        "success_url": f"{app_origin}/api/success",
        "fail_url": f"{app_origin}/api/fail",
        "cancel_url": f"{app_origin}/api/cancel",
        "ipn_url": f"{app_origin}/api/ipn",
        "emi_option": 0,
        "cus_name": cust.name,
        "cus_email": cust.email,
        "cus_phone": cust.phone,
        "cus_add1": cust.address,
        "cus_city": cust.city,
        "cus_country": cust.country,
        "shipping_method": "NO",
        "multi_card_name": "",
        "num_of_item": 1,
        "product_name": payload.product_name,
        "product_category": payload.product_category,
        "product_profile": "general",
        "value_a": user_id or "",
        "value_b": payload.product_id or "",
        "value_c": customer_email,
        "value_d": payload.product_name,
    }

    try:
        response = sslcz_client.createSession(post_body)
    except Exception as e:
        logger.error(f"Error calling SSLCommerz createSession: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to communicate with SSLCommerz: {str(e)}")

    logger.info(f"SSLCommerz createSession response: {response}")

    # Fallback retry in sandbox mode if merchant store credentials expired / deactivated
    if is_sandbox and isinstance(response, dict) and response.get("status") != "SUCCESS":
        failed_reason = str(response.get("failedreason") or "")
        if "Credential Error" in failed_reason or "De-active" in failed_reason:
            logger.warning("SSLCommerz store credential error with %s, falling back to official testbox sandbox...", store_id)
            backup_client, _, _, _ = _get_ssl_client("testbox", "qwerty")
            if backup_client:
                try:
                    retry_response = backup_client.createSession(post_body)
                    logger.info(f"SSLCommerz testbox retry response: {retry_response}")
                    if isinstance(retry_response, dict) and retry_response.get("status") == "SUCCESS":
                        response = retry_response
                except Exception as retry_err:
                    logger.error(f"testbox retry failed: {retry_err}")

    # Check session creation status
    if isinstance(response, dict) and response.get("status") == "SUCCESS":
        gateway_url = response.get("GatewayPageURL") or response.get("redirectGatewayURL")
        session_key = response.get("sessionkey")

        # Save order tracking info
        orders_db[tran_id] = {
            "tran_id": tran_id,
            "sessionkey": session_key,
            "amount": payload.amount,
            "product_name": payload.product_name,
            "customer": cust.model_dump(),
            "status": "INITIATED",
            "gateway_url": gateway_url,
            "init_response": response,
        }

        return {
            "status": "SUCCESS",
            "tran_id": tran_id,
            "sessionkey": session_key,
            "GatewayPageURL": gateway_url,
            "redirectGatewayURL": gateway_url,
        }
    else:
        failed_reason = response.get("failedreason") if isinstance(response, dict) else str(response)
        logger.error(f"Failed to create SSLCommerz session: {failed_reason}")
        return JSONResponse(
            status_code=400,
            content={
                "status": "FAILED",
                "message": "Could not create SSLCommerz payment session",
                "reason": failed_reason,
                "raw_response": response,
            }
        )


@app.post("/api/success")
async def payment_success(request: Request):
    """
    2. SSLCommerz POST callback on successful payment.
    Validates transaction order with SSLCommerz validation API, updates order in MongoDB, and redirects user to frontend.
    """
    form_data = await request.form()
    payload = dict(form_data)
    logger.info(f"SSLCommerz SUCCESS callback received: {payload}")

    tran_id = payload.get("tran_id")
    val_id = payload.get("val_id")
    amount = float(payload.get("amount") or 0.0)
    card_type = payload.get("card_type")
    bank_tran_id = payload.get("bank_tran_id")

    # Validate transaction with SSLCommerz validation API
    validation_res = None
    is_valid = False
    if val_id:
        try:
            sslcz_client, _, _, _ = _get_ssl_client()
            if sslcz_client:
                validation_res = sslcz_client.validationTransactionOrder(val_id)
                logger.info(f"Validation API response: {validation_res}")
                if isinstance(validation_res, dict) and validation_res.get("status") in ["VALID", "VALIDATED"]:
                    is_valid = True
        except Exception as e:
            logger.error(f"Validation check failed with error: {str(e)}")

    # Fulfill order in MongoDB Atlas (saves Transaction, Memo, and Active Subscription)
    await _fulfill_ssl_order(payload, val_id, tran_id, amount)

    # Update order state in memory
    if tran_id in orders_db:
        orders_db[tran_id].update({
            "status": "VALID" if is_valid else "PAID_UNVERIFIED",
            "val_id": val_id,
            "amount": amount or orders_db[tran_id].get("amount"),
            "card_type": card_type,
            "bank_tran_id": bank_tran_id,
            "callback_payload": payload,
            "validation_response": validation_res,
        })
    else:
        orders_db[tran_id] = {
            "tran_id": tran_id,
            "status": "VALID" if is_valid else "PAID_UNVERIFIED",
            "val_id": val_id,
            "amount": amount,
            "card_type": card_type,
            "bank_tran_id": bank_tran_id,
            "callback_payload": payload,
            "validation_response": validation_res,
        }

    frontend_origin = _resolve_origin(request, FRONTEND_URL)
    # Redirect to Frontend Success View
    redirect_url = (
        f"{frontend_origin}/?status=success"
        f"&tran_id={tran_id or ''}"
        f"&val_id={val_id or ''}"
        f"&amount={amount or ''}"
        f"&card_type={card_type or ''}"
        f"&bank_tran_id={bank_tran_id or ''}"
    )
    return RedirectResponse(url=redirect_url, status_code=303)


@app.post("/api/fail")
async def payment_fail(request: Request):
    """
    Handle SSLCommerz POST callback when payment fails.
    """
    form_data = await request.form()
    payload = dict(form_data)
    logger.warning(f"SSLCommerz FAIL callback received: {payload}")

    tran_id = payload.get("tran_id")
    error = payload.get("error") or "Payment transaction failed"

    if tran_id in orders_db:
        orders_db[tran_id].update({
            "status": "FAILED",
            "failure_reason": error,
            "callback_payload": payload,
        })

    frontend_origin = _resolve_origin(request, FRONTEND_URL)
    redirect_url = (
        f"{frontend_origin}/?status=failed"
        f"&tran_id={tran_id or ''}"
        f"&error={error}"
    )
    return RedirectResponse(url=redirect_url, status_code=303)


@app.post("/api/cancel")
async def payment_cancel(request: Request):
    """
    Handle SSLCommerz POST callback when user cancels payment.
    """
    form_data = await request.form()
    payload = dict(form_data)
    logger.info(f"SSLCommerz CANCEL callback received: {payload}")

    tran_id = payload.get("tran_id")

    if tran_id in orders_db:
        orders_db[tran_id].update({
            "status": "CANCELLED",
            "callback_payload": payload,
        })

    frontend_origin = _resolve_origin(request, FRONTEND_URL)
    redirect_url = (
        f"{frontend_origin}/?status=cancelled"
        f"&tran_id={tran_id or ''}"
    )
    return RedirectResponse(url=redirect_url, status_code=303)


@app.post("/api/ipn")
async def instant_payment_notification(request: Request):
    """
    3. Instant Payment Notification (IPN) webhook.
    Validates IPN hash using sslcz.hash_validate_ipn() and verifies transaction status.
    """
    # IPN can arrive as form-encoded data or JSON depending on SSLCommerz configuration
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        payload = await request.json()
    else:
        form_data = await request.form()
        payload = dict(form_data)

    logger.info(f"IPN Webhook Received: {payload}")

    if not payload:
        raise HTTPException(status_code=400, detail="Empty IPN payload")

    # Validate hash using SSLCommerz library
    sslcz_client, _, _, _ = _get_ssl_client()
    is_hash_valid = False
    if sslcz_client:
        try:
            is_hash_valid = sslcz_client.hash_validate_ipn(payload)
        except Exception as e:
            logger.error(f"Error in hash_validate_ipn: {str(e)}")

    tran_id = payload.get("tran_id")
    val_id = payload.get("val_id")
    ipn_status = payload.get("status")

    if not is_hash_valid:
        logger.warning(f"IPN Hash validation failed for tran_id: {tran_id}")
        return JSONResponse(
            status_code=400,
            content={
                "status": "FAILED",
                "message": "IPN hash validation failed",
                "tran_id": tran_id
            }
        )

    # Perform order validation via SSLCommerz validation API
    validation_res = None
    if val_id and sslcz_client:
        try:
            validation_res = sslcz_client.validationTransactionOrder(val_id)
            logger.info(f"IPN Validation response: {validation_res}")
        except Exception as e:
            logger.error(f"IPN Validation API call failed: {str(e)}")

    if tran_id in orders_db:
        orders_db[tran_id].update({
            "ipn_received": True,
            "ipn_status": ipn_status,
            "ipn_payload": payload,
            "validation_response": validation_res,
            "status": "VALID" if (validation_res and validation_res.get("status") in ["VALID", "VALIDATED"]) else ipn_status
        })

    # Fulfill order in MongoDB Atlas if valid or successful
    if ipn_status in ["VALID", "VALIDATED", "SUCCESS", "COMPLETE"] or (validation_res and validation_res.get("status") in ["VALID", "VALIDATED"]):
        await _fulfill_ssl_order(payload, val_id, tran_id, float(payload.get("amount") or 0.0))

    return {
        "status": "SUCCESS",
        "message": "IPN verified and processed successfully",
        "tran_id": tran_id,
        "ipn_status": ipn_status,
        "validation": validation_res
    }


@app.get("/api/query-session")
async def query_session(sessionkey: str = Query(..., description="SSLCommerz session key")):
    """
    Query transaction status by session key using sslcz.transaction_query_session().
    """
    sslcz_client, _, _, _ = _get_ssl_client()
    if not sslcz_client:
        raise HTTPException(status_code=503, detail="Payment gateway client is unavailable")
    try:
        response = sslcz_client.transaction_query_session(sessionkey)
        return {"status": "SUCCESS", "data": response}
    except Exception as e:
        logger.error(f"Failed to query transaction by sessionkey {sessionkey}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/query-tranid")
async def query_tranid(tran_id: str = Query(..., description="Transaction ID")):
    """
    Query transaction status by tran_id using sslcz.transaction_query_tranid().
    """
    sslcz_client, _, _, _ = _get_ssl_client()
    if not sslcz_client:
        raise HTTPException(status_code=503, detail="Payment gateway client is unavailable")
    try:
        response = sslcz_client.transaction_query_tranid(tran_id)
        return {
            "status": "SUCCESS",
            "data": response,
            "internal_order": orders_db.get(tran_id)
        }
    except Exception as e:
        logger.error(f"Failed to query transaction by tran_id {tran_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/refund")
async def init_refund(payload: RefundRequest):
    """
    4. Refund initialization endpoint using sslcz.init_refund().
    """
    sslcz_client, _, _, _ = _get_ssl_client()
    if not sslcz_client:
        raise HTTPException(status_code=503, detail="Payment gateway client is unavailable")
    try:
        response = sslcz_client.init_refund(
            bank_tran_id=payload.bank_tran_id,
            refund_amount=str(payload.refund_amount),
            refund_remarks=payload.refund_remarks
        )
        logger.info(f"Refund initiated response: {response}")
        return {
            "status": "SUCCESS",
            "data": response
        }
    except Exception as e:
        logger.error(f"Failed to initiate refund: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/refund-status")
async def refund_status(refund_ref_id: str = Query(..., description="Refund reference ID")):
    """
    Check refund status using sslcz.query_refund_status().
    """
    sslcz_client, _, _, _ = _get_ssl_client()
    if not sslcz_client:
        raise HTTPException(status_code=503, detail="Payment gateway client is unavailable")
    try:
        response = sslcz_client.query_refund_status(refund_ref_id)
        return {"status": "SUCCESS", "data": response}
    except Exception as e:
        logger.error(f"Failed to query refund status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/orders")
async def list_orders():
    """
    List all in-memory recorded transactions.
    """
    return {"orders": list(orders_db.values())}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
