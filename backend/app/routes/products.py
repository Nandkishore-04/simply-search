from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.product import Product
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse
from ..services.semantic_search import SmartSearch

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/search", response_model=List[ProductResponse])
def search_products(
    query: Optional[str] = Query(None),
    use_smart: bool = Query(default=True, description="Use smart keyword understanding"),
    db: Session = Depends(get_db)
):
    """
    Search products with optional smart keyword understanding
    
    - If query is empty, returns all products
    - use_smart=true: Understands synonyms (stopping = brake, motor = engine)
    - use_smart=false: Traditional exact keyword matching
    """
    # Get all products from database
    all_products = db.query(Product).all()
    
    if not query or not query.strip():
        return all_products
    
    if use_smart and all_products:
        # Use smart keyword expansion
        smart_search = SmartSearch()
        products = smart_search.search(query, all_products)
        return products
    else:
        # Traditional SQL LIKE search (fallback)
        search_term = f"%{query}%"
        products = db.query(Product).filter(
            (Product.product_name.like(search_term)) |
            (Product.part_number.like(search_term)) |
            (Product.bike_models.like(search_term)) |
            (Product.brand.like(search_term)) |
            (Product.category.like(search_term))
        ).all()
        
        return products


@router.get("", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    """
    Get all products in inventory
    """
    return db.query(Product).all()


@router.get("/by-bike", response_model=List[ProductResponse])
def get_parts_by_bike(
    model: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    """
    Find all parts compatible with a specific bike model
    """
    search_term = f"%{model}%"
    products = db.query(Product).filter(
        Product.bike_models.like(search_term)
    ).all()
    
    return products


@router.get("/by-part-number", response_model=List[ProductResponse])
def search_by_part_number(
    part_number: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    """
    Search products by part number
    """
    search_term = f"%{part_number}%"
    products = db.query(Product).filter(
        Product.part_number.like(search_term)
    ).all()
    
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get a single product by ID
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product
    """
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing product
    """
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product
    """
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return None
