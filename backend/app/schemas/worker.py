"""Pydantic schemas for worker-related requests and responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class WorkerCreate(BaseModel):
    name: Optional[str] = None
    trade: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    area_name: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class WorkerProfileUpdate(BaseModel):
    name: Optional[str] = None
    trade: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    area_name: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    skills: Optional[str] = None      # comma-separated e.g. "Leak repair,Geyser fitting"
    days: Optional[str] = None        # comma-separated e.g. "Mon,Tue,Wed"
    hours: Optional[str] = None       # e.g. "9 AM – 7 PM"
    phone: Optional[str] = None


class WorkerStatusUpdate(BaseModel):
    status: str   # "available" | "busy" | "offline"


class WorkerOut(BaseModel):
    id: int
    user_id: int
    trade: Optional[str]
    experience_years: Optional[int]
    bio: Optional[str]
    area_name: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    status: str
    is_available: bool
    rating_avg: float
    total_jobs: int
    total_reviews: int
    skills: Optional[str]
    days: Optional[str]
    hours: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class WorkerNearbyOut(WorkerOut):
    distance_km: Optional[float] = None


class WorkerWithUserOut(WorkerOut):
    """Worker profile with joined user fields for display."""
    user_name: Optional[str] = None
    user_phone: Optional[str] = None

    model_config = {"from_attributes": True}

    @classmethod
    def model_validate(cls, obj, **kwargs):
        data = super().model_validate(obj, **kwargs)
        if hasattr(obj, "user") and obj.user:
            data.user_name = obj.user.name
            data.user_phone = obj.user.phone
        return data
