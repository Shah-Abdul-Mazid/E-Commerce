import asyncio
from typing import Dict
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Cache Motor clients by event loop ID so serverless (Vercel) and local uvicorn never hit closed-loop errors
_clients_by_loop: Dict[int, AsyncIOMotorClient] = {}


class Base(DeclarativeBase):
    pass


def get_motor_client() -> AsyncIOMotorClient:
    try:
        loop = asyncio.get_running_loop()
        loop_id = id(loop)
    except RuntimeError:
        loop_id = 0

    client = _clients_by_loop.get(loop_id)
    if client is None:
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=10000,
        )
        _clients_by_loop[loop_id] = client
    return client


def get_database() -> AsyncIOMotorDatabase:
    return get_motor_client()[settings.MONGODB_DB_NAME]


async def get_async_db() -> AsyncIOMotorDatabase:
    yield get_database()


async def init_mongodb_indexes(db: AsyncIOMotorDatabase) -> None:
    """Create indexes on core MongoDB collections."""
    await db["users"].create_index("id", unique=True)
    await db["users"].create_index("email", unique=True)
    await db["products"].create_index("id", unique=True)
    await db["transactions"].create_index("id", unique=True)
    await db["transactions"].create_index("order_id", unique=True)
    await db["transactions"].create_index("user_id")
    await db["transaction_memos"].create_index("id", unique=True)
    await db["transaction_memos"].create_index("transaction_id", unique=True)
    await db["subscriptions"].create_index("id", unique=True)
    await db["subscriptions"].create_index("user_id")
