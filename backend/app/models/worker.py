"""Worker model — trade profile linked to a User."""

import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Trade(str, enum.Enum):
    electrician = "electrician"
    plumber = "plumber"
    ac_technician = "ac_technician"
    carpenter = "carpenter"
    mechanic = "mechanic"
    painter = "painter"
    mason = "mason"
    welder = "welder"
    appliance = "appliance"
    general = "general"
    other = "other"


class WorkerStatus(str, enum.Enum):
    available = "available"
    busy = "busy"
    offline = "offline"


class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    # Profile (populated via voice/AI during onboarding)
    trade = Column(Enum(Trade), nullable=True)
    experience_years = Column(Integer, nullable=True)
    bio = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)        # comma-separated e.g. "Leak repair,Geyser fitting"
    days = Column(String(100), nullable=True)   # comma-separated e.g. "Mon,Tue,Wed"
    hours = Column(String(50), nullable=True)   # e.g. "9 AM – 7 PM"

    # Location
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    area_name = Column(String(255), nullable=True)

    # Availability
    status = Column(Enum(WorkerStatus), default=WorkerStatus.offline)
    is_available = Column(Boolean, default=False)

    # Trust / reputation
    rating_avg = Column(Float, default=0.0)
    total_jobs = Column(Integer, default=0)
    total_reviews = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="worker_profile")
    jobs = relationship("Job", back_populates="worker", foreign_keys="Job.worker_id")
    reviews = relationship("Review", back_populates="worker")

    def __repr__(self):
        return f"<Worker(id={self.id}, trade={self.trade}, status={self.status})>"
