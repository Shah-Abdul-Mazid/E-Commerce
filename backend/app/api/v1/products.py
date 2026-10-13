import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_async_db
from app.core.deps import get_current_admin
from app.models.entities import ProductType
from app.schemas.all_schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    UserResponse,
)

router = APIRouter(prefix="/products", tags=["Products & Packages"])


def _doc_to_product_response(doc: dict) -> ProductResponse:
    return ProductResponse(
        id=doc["id"],
        title=doc["title"],
        badge=doc.get("badge"),
        description=doc.get("description"),
        product_type=ProductType(
            doc.get("product_type", ProductType.SINGLE_TOOL.value)
        ),
        price_bdt=float(doc.get("price_bdt", 0.0)),
        features=doc.get("features") or [],
        icon_name=doc.get("icon_name") or "Zap",
        is_active=doc.get("is_active", True),
        created_at=doc.get("created_at", datetime.utcnow()),
    )


@router.get("", response_model=List[ProductResponse])
async def list_products(
    include_inactive: bool = Query(False, description="Include deactivated products"),
    db: AsyncIOMotorDatabase = Depends(get_async_db),
):
    filter_query = {} if include_inactive else {"is_active": True}
    cursor = db["products"].find(filter_query).sort("price_bdt", 1)
    docs = await cursor.to_list(length=500)
    return [_doc_to_product_response(d) for d in docs]


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreate,
    db: AsyncIOMotorDatabase = Depends(get_async_db),
    admin: UserResponse = Depends(get_current_admin),
):
    product_doc = {
        "id": str(uuid.uuid4()),
        "title": payload.title,
        "badge": payload.badge,
        "description": payload.description,
        "product_type": payload.product_type.value,
        "price_bdt": float(payload.price_bdt),
        "features": payload.features or [],
        "icon_name": payload.icon_name or "Zap",
        "is_active": True,
        "created_at": datetime.utcnow(),
    }
    await db["products"].insert_one(product_doc)
    return _doc_to_product_response(product_doc)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    db: AsyncIOMotorDatabase = Depends(get_async_db),
    admin: UserResponse = Depends(get_current_admin),
):
    existing = await db["products"].find_one({"id": product_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{product_id}' not found.",
        )

    update_data = payload.model_dump(exclude_unset=True)
    if "product_type" in update_data and update_data["product_type"] is not None:
        update_data["product_type"] = (
            update_data["product_type"].value
            if hasattr(update_data["product_type"], "value")
            else str(update_data["product_type"])
        )

    if update_data:
        await db["products"].update_one({"id": product_id}, {"$set": update_data})
        existing.update(update_data)

    return _doc_to_product_response(existing)


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_async_db),
    admin: UserResponse = Depends(get_current_admin),
):
    existing = await db["products"].find_one({"id": product_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{product_id}' not found.",
        )

    await db["products"].delete_one({"id": product_id})
    return {
        "status": "SUCCESS",
        "message": f"Product '{existing['title']}' was deleted successfully.",
        "deleted_id": product_id,
    }
