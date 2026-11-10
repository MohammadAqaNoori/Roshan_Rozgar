"""Job model — a booking between a customer and a worker."""

import enum
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class JobStatus(str, enum.Enum):
    requested = "requested"    # customer posted, looking for worker
    negotiated = "negotiated"  # communication started, price discussed
    confirmed = "confirmed"    # booking locked
    in_progress = "in_progress" # worker on the way / working
    completed = "completed"
    cancelled = "cancelled"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=True)  # nullable until assigned

    # Job details (may be AI-extracted from voice)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)       # raw customer description
    trade_required = Column(String(50), nullable=True)

    # Location
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    area_name = Column(String(255), nullable=True)

    # Pricing
    agreed_price = Column(Float, nullable=True)
    currency = Column(String(10), default="PKR")

    # Status
    status = Column(Enum(JobStatus), default=JobStatus.requested)
    scheduled_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    customer = relationship("User", back_populates="jobs_as_customer", foreign_keys=[customer_id])
    worker = relationship("Worker", back_populates="jobs", foreign_keys=[worker_id])
    messages = relationship("Message", back_populates="job")
    review = relationship("Review", back_populates="job", uselist=False)

    def __repr__(self):
        return f"<Job(id={self.id}, status={self.status})>"
