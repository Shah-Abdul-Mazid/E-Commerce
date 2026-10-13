import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.entities import User, UserRole, Product, ProductType
from app.api.v1.auth import router as auth_router
from app.api.v1.products import router as products_router
from app.api.v1.checkout import router as checkout_router
from app.api.v1.memos import router as memos_router

async def seed_initial_data():
    """Seed default admins, demo customers, and subscription products/tools"""
    async with AsyncSessionLocal() as db:
        # 1. Accounts to seed/update (admins & demo customers) with secure bcrypt hashed passwords
        accounts_to_seed = [
            # Admins
            {
                "email": "admin@samjap.mart",
                "full_name": "System Administrator",
                "phone_number": "01700000001",
                "password": "Admin@123",
                "role": UserRole.ADMIN,
            },
            {
                "email": "mazid@samjap.mart",
                "full_name": "Shah Abdul Mazid",
                "phone_number": "01711009988",
                "password": "Mazid@123",
                "role": UserRole.ADMIN,
            },
            {
                "email": "popy@samjap.mart",
                "full_name": "Jannat Farhana Popy ❤️",
                "phone_number": "01844998877",
                "password": "Popy@123",
                "role": UserRole.ADMIN,
            },
            # Demo Customers
            {
                "email": "customer1@gmail.com",
                "full_name": "Demo Customer One",
                "phone_number": "01711223344",
                "password": "Customer@123",
                "role": UserRole.CUSTOMER,
            },
            {
                "email": "customer2@yahoo.com",
                "full_name": "Demo Customer Two",
                "phone_number": "01811223344",
                "password": "Customer@123",
                "role": UserRole.CUSTOMER,
            },
            {
                "email": "customer3@outlook.com",
                "full_name": "Demo Customer Three",
                "phone_number": "01911223344",
                "password": "Customer@123",
                "role": UserRole.CUSTOMER,
            },
        ]

        for acc in accounts_to_seed:
            res = await db.execute(select(User).where(User.email == acc["email"].lower()))
            existing_user = res.scalar_one_or_none()
            if existing_user:
                existing_user.full_name = acc["full_name"]
                existing_user.role = acc["role"]
                existing_user.phone_number = acc["phone_number"]
                existing_user.hashed_password = get_password_hash(acc["password"])
                existing_user.is_active = True
            else:
                new_user = User(
                    email=acc["email"].lower(),
                    full_name=acc["full_name"],
                    phone_number=acc["phone_number"],
                    hashed_password=get_password_hash(acc["password"]),
                    role=acc["role"],
                    is_active=True,
                )
                db.add(new_user)

        await db.commit()

        # 3. Products & Packages Seed
        prod_count = await db.execute(select(Product))
        if not prod_count.scalars().first():
            catalog = [
                # Packages
                Product(
                    title="Standard Package",
                    badge=None,
                    description="Essential research and academic drafting bundle for students & educators.",
                    product_type=ProductType.PACKAGE,
                    price_bdt=299.00,
                    features=[
                        "ChatGPT Plus (Shared VIP)",
                        "Grammarly Premium (Edu License)",
                        "Quillbot Premium (Full Paraphrase)",
                        "Instant Access via Extension",
                        "24/7 Dedicated Server Uptime"
                    ],
                    icon_name="Zap"
                ),
                Product(
                    title="Premium Package",
                    badge="MOST POPULAR",
                    description="Comprehensive powerhouse suite for content creators, researchers, and AI developers.",
                    product_type=ProductType.PACKAGE,
                    price_bdt=599.00,
                    features=[
                        "ChatGPT Plus (GPT-4o & Canvas Access)",
                        "Turnitin Plagiarism & AI Detection",
                        "Grammarly Premium & Quillbot Premium",
                        "Perplexity Pro Unlimited Search",
                        "Stealth Writer (Humanize AI)",
                        "High-Speed Cookie Session Sync"
                    ],
                    icon_name="Crown"
                ),
                Product(
                    title="Advance Package",
                    badge="ALL-IN-ONE MASTER",
                    description="The ultimate unlocked digital toolkit with world-class learning and AI generators.",
                    product_type=ProductType.PACKAGE,
                    price_bdt=850.00,
                    features=[
                        "All Premium Package Tools Included",
                        "Coursera Plus (Verified Certificates)",
                        "Udemy Business Pro Library Access",
                        "Midjourney / Claude 3.5 Sonnet",
                        "Dedicated Private Browser Profiles",
                        "Priority WhatsApp VIP Concierge"
                    ],
                    icon_name="Sparkles"
                ),
                Product(
                    title="SEO Combo Bundle",
                    badge="SEO BUNDLE",
                    description="Engineered specifically for digital marketers, bloggers, and SEO agencies.",
                    product_type=ProductType.PACKAGE,
                    price_bdt=299.00,
                    features=[
                        "Grammarly Premium",
                        "Quillbot Unlimited",
                        "WordHero / Copy.ai",
                        "Indexing & Rank Tracker Tools",
                        "Unlimited Daily Paraphrases"
                    ],
                    icon_name="TrendingUp"
                ),

                # Single Tools
                Product(
                    title="ChatGPT Plus (GPT-4o)",
                    badge="INSTANT",
                    description="OpenAI's most capable AI with Vision, Voice, and Custom GPTs.",
                    product_type=ProductType.SINGLE_TOOL,
                    price_bdt=200.00,
                    features=["GPT-4o Turbo", "Canvas Editor", "DALL·E 3 Image Generation"],
                    icon_name="Bot"
                ),
                Product(
                    title="Grammarly Premium",
                    badge="ACADEMIC",
                    description="Advanced writing assistance, tone adjuster, and plagiarism detector.",
                    product_type=ProductType.SINGLE_TOOL,
                    price_bdt=200.00,
                    features=["Full Sentence Rewrites", "Plagiarism Checker", "Tone Suggestions"],
                    icon_name="CheckCheck"
                ),
                Product(
                    title="Quillbot Premium",
                    badge="UNLIMITED",
                    description="World-renowned paraphraser with 7 distinct writing modes and summarizer.",
                    product_type=ProductType.SINGLE_TOOL,
                    price_bdt=200.00,
                    features=["Unlimited Words Paraphrase", "7 Modes", "Chrome Extension"],
                    icon_name="Feather"
                ),
                Product(
                    title="Stealth Writer (Ghost AI)",
                    badge="BYPASS AI",
                    description="Undetectable AI humanizer that easily bypasses Turnitin and Originality.ai.",
                    product_type=ProductType.SINGLE_TOOL,
                    price_bdt=399.00,
                    features=["Bypasses Turnitin AI", "Zero Plagiarism", "Preserves Core Meaning"],
                    icon_name="Ghost"
                ),
                Product(
                    title="Coursera Plus Subscription",
                    badge="CERTIFIED",
                    description="Unlimited access to 7,000+ world-class courses from Google, IBM, Yale.",
                    product_type=ProductType.SINGLE_TOOL,
                    price_bdt=200.00,
                    features=["Shareable Certificates", "Hands-on Projects", "Professional Credentials"],
                    icon_name="GraduationCap"
                ),
            ]
            for p in catalog:
                db.add(p)

        await db.commit()

_db_initialized = False

async def ensure_db_initialized():
    global _db_initialized
    if _db_initialized:
        return
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_initial_data()
    _db_initialized = True

@asynccontextmanager
async def lifespan(app: FastAPI):
    await ensure_db_initialized()
    yield
    await engine.dispose()

app = FastAPI(
    title="EZOPY MART TECH - API",
    description="Backend API for EZOPY MART TECH Tools Marketplace & DBBL NexusPay Memo Engine",
    version="2.0.0",
    lifespan=lifespan
)

@app.middleware("http")
async def db_init_middleware(request, call_next):
    if not _db_initialized:
        await ensure_db_initialized()
    return await call_next(request)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "marketplace": "SAMJAP Mart",
        "romantic_tribute": "Shah Abdul Mazid Loves Jannat Farhana Popy Forever ❤️",
        "tagline": "Bangladesh's Most Romantic & Premium AI Tools Marketplace",
        "status": "ONLINE",
        "api_docs": "/docs",
        "version": "2.0.0"
    }
