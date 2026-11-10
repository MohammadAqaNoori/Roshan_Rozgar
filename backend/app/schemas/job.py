"""Pydantic schemas for job requests and responses."""

from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class JobCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    trade_required: Optional[str] = None
    area_name: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    scheduled_time: Optional[datetime] = None
    worker_id: Optional[int] = None   # optionally request a specific worker


class JobUpdate(BaseModel):
    worker_id: Optional[int] = None
    agreed_price: Optional[float] = None
    status: Optional[str] = None


class JobOut(BaseModel):
    id: int
    customer_id: int
    worker_id: Optional[int]
    title: Optional[str]
    description: Optional[str]
    trade_required: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    area_name: Optional[str]
    agreed_price: Optional[float]
    currency: str
    status: str
    scheduled_time: Optional[datetime]
    created_at: datetime
    completed_at: Optional[datetime]

    model_config = {"from_attributes": True}
