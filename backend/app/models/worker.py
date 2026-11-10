"""Worker model — extends User with trade-specific profile info."""

import enum
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime,
    ForeignKey, Enum, Text,
)
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
    other = "other"


class WorkerStatus(str, enum.Enum):
    available = "available"      # free for new jobs
    busy = "busy"                  # currently on a job
    offline = "offline"            # not taking requests


class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    # Profile (may be populated via voice/AI)
    trade = Column(Enum(Trade), nullable=True)
    experience_years = Column(Integer, nullable=True)
    bio = Column(Text, nullable=True)  # AI-extracted from voice

    # Location
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    area_name = Column(String(255), nullable=True)  # e.g. "G-9", "F-7"

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
