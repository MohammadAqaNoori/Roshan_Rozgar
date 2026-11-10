"""User model — base for both customers and workers."""

import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, Enum, DateTime, Boolean
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserRole(str, enum.Enum):
    customer = "customer"
    worker = "worker"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    phone = Column(String(20), unique=True, nullable=False, index=True)  # primary identifier
    name = Column(String(255), nullable=True)  # may be filled later via voice
    role = Column(Enum(UserRole), nullable=False, default=UserRole.customer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    worker_profile = relationship("Worker", back_populates="user", uselist=False)
    jobs_as_customer = relationship("Job", back_populates="customer", foreign_keys="Job.customer_id")
    messages = relationship("Message", back_populates="sender")
    reviews_given = relationship("Review", back_populates="customer")

    def __repr__(self):
        return f"<User(id={self.id}, phone={self.phone}, role={self.role})>"
