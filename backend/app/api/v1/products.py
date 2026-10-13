from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_async_db
from app.core.deps import get_current_admin
from app.models.entities import Product, User
from app.schemas.all_schemas import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products & Packages"])

@router.get("", response_model=List[ProductResponse])
async def list_products(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Product).where(Product.is_active == True).order_by(Product.price_bdt.asc()))
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
        icon_name=payload.icon_name,
        is_active=True
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return ProductResponse.model_validate(product)
