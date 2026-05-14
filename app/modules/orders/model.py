

import uuid

from app.modules.status.model import Status
from db.base import Base
from sqlalchemy import CheckConstraint, Index, String, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.modules.users.model import User
from app.modules.products.model import Product



# avoid cicular impoert
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.modules.users.model import User
    from app.modules.products.model import Product



class Order(Base):
    __tablename__ = "orders"
    __table_args__=(
        CheckConstraint("quantity >= 1", name="ch_orders_quantity_positive"),
        Index("idx_orders_user_id", "user_id")
    )

    # data table
    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)


    # relationships
    status: Mapped["Status"] = relationship("Status")
    user: Mapped["User"] = relationship("User",back_populates="orders")
    items:Mapped[list["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )


# middle table
class OrderItem(Base):
    __tablename__ = "order_items"
    __table_args__=(
        CheckConstraint("quantity >= 1", name="ch_order_items_quantity_positive"),
        Index("idx_order_items_order_id", "order_id"),
        Index("idx_order_items_product_id", "product_id")
    )

    # data table
    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    order_id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    quantity:Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # relationships
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship("Product", back_populates="order_items")
    status: Mapped["Status"] = relationship("Status")
    