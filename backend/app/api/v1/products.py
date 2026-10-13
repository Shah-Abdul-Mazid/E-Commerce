from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.core.database import get_async_db
from app.core.deps import get_current_admin
from app.models.entities import Product, User
from app.schemas.all_schemas import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products & Packages"])

@router.get("", response_model=List[ProductResponse])
async def list_products(
    include_inactive: bool = Query(False, description="Include deactivated products"),
    db: AsyncSession = Depends(get_async_db)
):
    query = select(Product)
    if not include_inactive:
        query = query.where(Product.is_active == True)
    query = query.order_by(Product.price_bdt.asc())
    
    result = await db.execute(query)
    products = result.scalars().all()
    return [ProductResponse.model_validate(p) for p in products]

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_async_db),
    admin: User = Depends(get_current_admin)
):
    product = Product(
        title=payload.title,
        badge=payload.badge,
        description=payload.description,
        product_type=payload.product_type,
        price_bdt=payload.price_bdt,
        features=payload.features,
        icon_name=payload.icon_name or "Zap",
        is_active=True
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return ProductResponse.model_validate(product)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_async_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{product_id}' not found."
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)
    return ProductResponse.model_validate(product)

@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_async_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{product_id}' not found."
        )

    await db.delete(product)
    await db.commit()
    return {
        "status": "SUCCESS",
        "message": f"Product '{product.title}' was deleted successfully.",
        "deleted_id": product_id
    }
