

import uuid

from app.modules.orders.model import Order
from app.modules.roles.model import Role
from app.modules.status.model import Status
from db.base import Base
from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID


class User(Base):
    
    __tablename__="users"

    __table_args__=(Index("idx_users_email", "email"))

    # data table

    # user info
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(120),unique=True, nullable=False)
    user_name:Mapped[str] = mapped_column(String(20), nullable=False)
    password_hash:Mapped[str] = mapped_column(String(200), nullable=False)

    created_at: Mapped[str] = mapped_column(String(20), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(20), nullable=False)

    # relationships
    orders: Mapped[list["Order"]] = relationship(
        "Order", 
        back_populates="user",
        cascade="all, delete-orphan"
    )

    status:Mapped["Status"] = relationship("Status")
    
    role_id:Mapped["Role"] = mapped_column(    
        UUID(as_uuid=True),
        ForeignKey("roles.id"),
        nullable=False,
    )
    role: Mapped["Role"] = relationship("Role", back_populates="users")