import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime

from app.api.v1.auth import router as auth_router
from app.api.v1.checkout import router as checkout_router
from app.api.v1.memos import router as memos_router
from app.api.v1.products import router as products_router
from app.core.config import settings
from app.core.database import get_database, init_mongodb_indexes
from app.core.security import get_password_hash
from app.models.entities import ProductType, UserRole
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

_db_initialized = False


async def seed_initial_data():
    """Initialize MongoDB Atlas indexes and seed initial data from environment variables."""
    if not settings.MONGODB_URI:
        return

    db = get_database()
    await init_mongodb_indexes(db)

    # Seed admin accounts only if configured via .env
    env_accounts = [
        (
            os.getenv("ADMIN_EMAIL"),
            os.getenv("ADMIN_PASSWORD"),
            "System Administrator",
            UserRole.ADMIN.value,
        ),
        (
            os.getenv("MAZID_EMAIL"),
            os.getenv("MAZID_PASSWORD"),
            "Shah Abdul Mazid",
            UserRole.ADMIN.value,
        ),
        (
            os.getenv("POPY_EMAIL"),
            os.getenv("POPY_PASSWORD"),
            "Jannat Farhana Popy",
            UserRole.ADMIN.value,
        ),
    ]

    for email_val, pwd_val, full_name, role_val in env_accounts:
        if not email_val or not pwd_val:
            continue
        email_lower = email_val.strip().lower()
        existing_user = await db["users"].find_one({"email": email_lower})
        hashed_pwd = get_password_hash(pwd_val)
        if existing_user:
            await db["users"].update_one(
                {"email": email_lower},
                {
                    "$set": {
                        "full_name": full_name,
                        "role": role_val,
                        "hashed_password": hashed_pwd,
                        "is_active": True,
                    }
                },
            )
        else:
            await db["users"].insert_one(
                {
                    "id": str(uuid.uuid4()),
                    "email": email_lower,
                    "full_name": full_name,
                    "phone_number": None,
                    "hashed_password": hashed_pwd,
                    "role": role_val,
                    "is_active": True,
                    "created_at": datetime.utcnow(),  # noqa: DTZ003
                }
            )

    prod_count = await db["products"].count_documents({})
    if prod_count == 0:
        now = datetime.utcnow()  # noqa: DTZ003
        catalog = [
            {
                "id": str(uuid.uuid4()),
                "title": "Standard Package",
                "badge": None,
                "description": "Essential research and academic drafting bundle for students & educators.",
                "product_type": ProductType.PACKAGE.value,
                "price_bdt": 299.00,
                "features": [
                    "ChatGPT Plus (Shared VIP)",
                    "Grammarly Premium (Edu License)",
                    "Quillbot Premium (Full Paraphrase)",
                    "Instant Access via Extension",
                    "24/7 Dedicated Server Uptime",
                ],
                "icon_name": "Zap",
                "is_active": True,
                "created_at": now,
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Premium Package",
                "badge": "MOST POPULAR",
                "description": "Comprehensive powerhouse suite for content creators, researchers, and AI developers.",
                "product_type": ProductType.PACKAGE.value,
                "price_bdt": 599.00,
                "features": [
                    "ChatGPT Plus (GPT-4o & Canvas Access)",
                    "Turnitin Plagiarism & AI Detection",
                    "Grammarly Premium & Quillbot Premium",
                    "Perplexity Pro Unlimited Search",
                    "Stealth Writer (Humanize AI)",
                    "High-Speed Cookie Session Sync",
                ],
                "icon_name": "Crown",
                "is_active": True,
                "created_at": now,
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Advance Package",
                "badge": "ALL-IN-ONE MASTER",
                "description": "The ultimate unlocked digital toolkit with world-class learning and AI generators.",
                "product_type": ProductType.PACKAGE.value,
                "price_bdt": 850.00,
                "features": [
                    "All Premium Package Tools Included",
                    "Coursera Plus (Verified Certificates)",
                    "Udemy Business Pro Library Access",
                    "Midjourney / Claude 3.5 Sonnet",
                    "Dedicated Private Browser Profiles",
                    "Priority WhatsApp VIP Concierge",
                ],
                "icon_name": "Sparkles",
                "is_active": True,
                "created_at": now,
            },
            {
                "id": str(uuid.uuid4()),
                "title": "SEO Combo Bundle",
                "badge": "SEO BUNDLE",
                "description": "Engineered specifically for digital marketers, bloggers, and SEO agencies.",
                "product_type": ProductType.PACKAGE.value,
                "price_bdt": 299.00,
                "features": [
                    "Grammarly Premium",
                    "Quillbot Unlimited",
                    "WordHero / Copy.ai",
                    "Indexing & Rank Tracker Tools",
                    "Unlimited Daily Paraphrases",
                ],
                "icon_name": "TrendingUp",
                "is_active": True,
                "created_at": now,
            },
            {
                "id": str(uuid.uuid4()),
                "title": "ChatGPT Plus (GPT-4o)",
                "badge": "INSTANT",
                "description": "OpenAI's most capable AI with Vision, Voice, and Custom GPTs.",
                "product_type": ProductType.SINGLE_TOOL.value,
                "price_bdt": 200.00,
                "features": [
                    "GPT-4o Turbo",
                    "Canvas Editor",
                    "DALL·E 3 Image Generation",
                ],
                "icon_name": "Bot",
                "is_active": True,
                "created_at": now,
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Grammarly Premium",
                "badge": "ACADEMIC",
                "description": "Advanced writing assistance, tone adjuster, and plagiarism detector.",
                "product_type": ProductType.SINGLE_TOOL.value,
                "price_bdt": 200.00,
                "features": [
                    "Full Sentence Rewrites",
                    "Plagiarism Checker",
                    "Tone Suggestions",
                ],
                "icon_name": "CheckCheck",
                "is_active": True,
                "created_at": now,
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Quillbot Premium",
                "badge": "UNLIMITED",
                "description": "World-renowned paraphraser with 7 distinct writing modes and summarizer.",
                "product_type": ProductType.SINGLE_TOOL.value,
                "price_bdt": 200.00,
                "features": [
                    "Unlimited Words Paraphrase",
                    "7 Modes",
                    "Chrome Extension",
                ],
                "icon_name": "Feather",
                "is_active": True,
                "created_at": now,
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Stealth Writer (Ghost AI)",
                "badge": "BYPASS AI",
                "description": "Undetectable AI humanizer that easily bypasses Turnitin and Originality.ai.",
                "product_type": ProductType.SINGLE_TOOL.value,
                "price_bdt": 399.00,
                "features": [
                    "Bypasses Turnitin AI",
                    "Zero Plagiarism",
                    "Preserves Core Meaning",
                ],
                "icon_name": "Ghost",
                "is_active": True,
                "created_at": now,
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Coursera Plus Subscription",
                "badge": "CERTIFIED",
                "description": "Unlimited access to 7,000+ world-class courses from Google, IBM, Yale.",
                "product_type": ProductType.SINGLE_TOOL.value,
                "price_bdt": 200.00,
                "features": [
                    "Shareable Certificates",
                    "Hands-on Projects",
                    "Professional Credentials",
                ],
                "icon_name": "GraduationCap",
                "is_active": True,
                "created_at": now,
            },
        ]
        await db["products"].insert_many(catalog)


async def ensure_db_initialized():
    global _db_initialized
    if _db_initialized:
        return
    await seed_initial_data()
    _db_initialized = True


@asynccontextmanager
async def lifespan(app: FastAPI):
    await ensure_db_initialized()
    yield


app = FastAPI(
    title="EZOPY MART TECH - API",
    description="Backend API for EZOPY MART TECH Tools Marketplace & DBBL NexusPay Memo Engine (MongoDB Atlas)",
    version="2.0.0",
    lifespan=lifespan,
)


@app.middleware("http")
async def db_init_middleware(request, call_next):
    if not _db_initialized:
        await ensure_db_initialized()
    return await call_next(request)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(products_router, prefix=settings.API_V1_STR)
app.include_router(checkout_router, prefix=settings.API_V1_STR)
app.include_router(memos_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "marketplace": settings.PROJECT_NAME,
        "database": "MongoDB Atlas",
        "status": "ONLINE",
        "api_docs": "/docs",
        "version": "2.0.0",
    }
