import os
import uuid
import logging
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sslcommerz_lib import SSLCOMMERZ

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Read configurations with fallback support for variable names
STORE_ID = os.getenv("SSL_STORE_ID") or os.getenv("SSL_COMMERZ_STORE_ID") or "testbox"
STORE_PASS = (
    os.getenv("SSL_STORE_PASSWORD") or os.getenv("SSL_COMMERZ_STORE_PASS") or "qwerty"
)
IS_SANDBOX = os.getenv("SSL_IS_LIVE", "false").strip().lower() not in (
    "true",
    "1",
    "yes",
)

APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:8000").rstrip("/")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5174").rstrip("/")

logger.info(f"Initialized SSLCommerz with Store ID: {STORE_ID}, Sandbox: {IS_SANDBOX}")

# Initialize SSLCOMMERZ client
settings = {
    "store_id": STORE_ID,
    "store_pass": STORE_PASS,
    "issandbox": IS_SANDBOX,
}
sslcz = SSLCOMMERZ(settings)

# In-memory transaction and order store (for demo / state persistence)
orders_db: Dict[str, Dict[str, Any]] = {}

app = FastAPI(
    title="E-Commerce SSLCommerz Payment Gateway API",
    description="Full-stack FastAPI backend for SSLCommerz Sandbox payment integration",
    version="1.0.0",
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    product_name: str = Field(
        default="Premium Wireless Headphones", description="Name of the item"
    )
    product_category: str = Field(default="Electronics", description="Product category")
    customer: Optional[CustomerInfo] = Field(default_factory=CustomerInfo)
    tran_id: Optional[str] = Field(
        default=None, description="Optional custom transaction ID"
    )


class RefundRequest(BaseModel):
    bank_tran_id: str = Field(..., description="The transaction ID at Bank end")
    refund_amount: float = Field(..., gt=0, description="Amount to refund")
    refund_remarks: str = Field(..., description="Reason for refund")


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
        "docs_url": "/docs",
    }


@app.post("/api/init-payment")
async def init_payment(payload: PaymentInitRequest):
    """
    1. Initialize payment session with SSLCommerz.
    Returns the GatewayPageURL for frontend redirect.
    """
    tran_id = payload.tran_id or f"TXN-{uuid.uuid4().hex[:12].upper()}"
    cust = payload.customer or CustomerInfo()

    # Define callback URLs routed back to this FastAPI server
    post_body = {
        "total_amount": round(payload.amount, 2),
        "currency": "BDT",
        "tran_id": tran_id,
        "success_url": f"{APP_BASE_URL}/api/success",
        "fail_url": f"{APP_BASE_URL}/api/fail",
        "cancel_url": f"{APP_BASE_URL}/api/cancel",
        "ipn_url": f"{APP_BASE_URL}/api/ipn",
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
    }

    try:
        response = sslcz.createSession(post_body)
    except Exception as e:
        logger.error(f"Error calling SSLCommerz createSession: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to communicate with SSLCommerz: {str(e)}"
        )

    logger.info(f"SSLCommerz createSession response: {response}")

    # Check session creation status
    if isinstance(response, dict) and response.get("status") == "SUCCESS":
        gateway_url = response.get("GatewayPageURL") or response.get(
            "redirectGatewayURL"
        )
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
        failed_reason = (
            response.get("failedreason")
            if isinstance(response, dict)
            else str(response)
        )
        logger.error(f"Failed to create SSLCommerz session: {failed_reason}")
        return JSONResponse(
            status_code=400,
            content={
                "status": "FAILED",
                "message": "Could not create SSLCommerz payment session",
                "reason": failed_reason,
                "raw_response": response,
            },
        )


@app.post("/api/success")
async def payment_success(request: Request):
    """
    2. SSLCommerz POST callback on successful payment.
    Validates transaction order with SSLCommerz validation API, updates order, and redirects user to frontend.
    """
    form_data = await request.form()
    payload = dict(form_data)
    logger.info(f"SSLCommerz SUCCESS callback received: {payload}")

    tran_id = payload.get("tran_id")
    val_id = payload.get("val_id")
    amount = payload.get("amount")
    card_type = payload.get("card_type")
    bank_tran_id = payload.get("bank_tran_id")

    # Validate transaction with SSLCommerz validation API
    validation_res = None
    is_valid = False
    if val_id:
        try:
            validation_res = sslcz.validationTransactionOrder(val_id)
            logger.info(f"Validation API response: {validation_res}")
            if isinstance(validation_res, dict) and validation_res.get("status") in [
                "VALID",
                "VALIDATED",
            ]:
                is_valid = True
        except Exception as e:
            logger.error(f"Validation check failed with error: {str(e)}")

    # Update order state
    if tran_id in orders_db:
        orders_db[tran_id].update(
            {
                "status": "VALID" if is_valid else "PAID_UNVERIFIED",
                "val_id": val_id,
                "amount": amount or orders_db[tran_id].get("amount"),
                "card_type": card_type,
                "bank_tran_id": bank_tran_id,
                "callback_payload": payload,
                "validation_response": validation_res,
            }
        )
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

    # Redirect to Frontend Success View
    redirect_url = (
        f"{FRONTEND_URL}/?status=success"
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
        orders_db[tran_id].update(
            {
                "status": "FAILED",
                "failure_reason": error,
                "callback_payload": payload,
            }
        )

    redirect_url = (
        f"{FRONTEND_URL}/?status=failed&tran_id={tran_id or ''}&error={error}"
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
        orders_db[tran_id].update(
            {
                "status": "CANCELLED",
                "callback_payload": payload,
            }
        )

    redirect_url = f"{FRONTEND_URL}/?status=cancelled&tran_id={tran_id or ''}"
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
    is_hash_valid = False
    try:
        is_hash_valid = sslcz.hash_validate_ipn(payload)
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
                "tran_id": tran_id,
            },
        )

    # Perform order validation via SSLCommerz validation API
    validation_res = None
    if val_id:
        try:
            validation_res = sslcz.validationTransactionOrder(val_id)
            logger.info(f"IPN Validation response: {validation_res}")
        except Exception as e:
            logger.error(f"IPN Validation API call failed: {str(e)}")

    if tran_id in orders_db:
        orders_db[tran_id].update(
            {
                "ipn_received": True,
                "ipn_status": ipn_status,
                "ipn_payload": payload,
                "validation_response": validation_res,
                "status": "VALID"
                if (
                    validation_res
                    and validation_res.get("status") in ["VALID", "VALIDATED"]
                )
                else ipn_status,
            }
        )

    return {
        "status": "SUCCESS",
        "message": "IPN verified and processed successfully",
        "tran_id": tran_id,
        "ipn_status": ipn_status,
        "validation": validation_res,
    }


@app.get("/api/query-session")
async def query_session(
    sessionkey: str = Query(..., description="SSLCommerz session key"),
):
    """
    Query transaction status by session key using sslcz.transaction_query_session().
    """
    try:
        response = sslcz.transaction_query_session(sessionkey)
        return {"status": "SUCCESS", "data": response}
    except Exception as e:
        logger.error(
            f"Failed to query transaction by sessionkey {sessionkey}: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/query-tranid")
async def query_tranid(tran_id: str = Query(..., description="Transaction ID")):
    """
    Query transaction status by tran_id using sslcz.transaction_query_tranid().
    """
    try:
        response = sslcz.transaction_query_tranid(tran_id)
        return {
            "status": "SUCCESS",
            "data": response,
            "internal_order": orders_db.get(tran_id),
        }
    except Exception as e:
        logger.error(f"Failed to query transaction by tran_id {tran_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/refund")
async def init_refund(payload: RefundRequest):
    """
    4. Refund initialization endpoint using sslcz.init_refund().
    """
    try:
        response = sslcz.init_refund(
            bank_tran_id=payload.bank_tran_id,
            refund_amount=str(payload.refund_amount),
            refund_remarks=payload.refund_remarks,
        )
        logger.info(f"Refund initiated response: {response}")
        return {"status": "SUCCESS", "data": response}
    except Exception as e:
        logger.error(f"Failed to initiate refund: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/refund-status")
async def refund_status(
    refund_ref_id: str = Query(..., description="Refund reference ID"),
):
    """
    Check refund status using sslcz.query_refund_status().
    """
    try:
        response = sslcz.query_refund_status(refund_ref_id)
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
