from sqlalchemy import Column, Integer, String, Text, DECIMAL, DateTime
from sqlalchemy.sql import func
from ..database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(255), nullable=False, index=True)
    part_number = Column(String(100), nullable=True, index=True)
    bike_models = Column(Text, nullable=True)  # Store as comma-separated values
    category = Column(String(100), nullable=True, index=True)
    brand = Column(String(100), nullable=True, index=True)
    stock_quantity = Column(Integer, default=0)
    shelf_location = Column(String(100), nullable=True)
    price = Column(DECIMAL(10, 2), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
