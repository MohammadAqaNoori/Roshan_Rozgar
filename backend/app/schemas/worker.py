"""Pydantic schemas for worker-related requests and responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class WorkerProfileUpdate(BaseModel):
    """Manual update — but most fields arrive via AI-extracted voice."""
    name: Optional[str] = None
    trade: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    area_name: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class WorkerStatusUpdate(BaseModel):
    status: str  # available | busy | offline


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
    created_at: datetime

    model_config = {"from_attributes": True}


class WorkerNearbyOut(WorkerOut):
    """Extended with distance for discovery results."""
    distance_km: Optional[float] = None
