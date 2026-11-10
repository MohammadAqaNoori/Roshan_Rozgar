"""Pydantic schemas for messages and reviews."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class MessageOut(BaseModel):
    id: int
    job_id: int
    sender_id: int
    type: str
    content: Optional[str]
    audio_url: Optional[str]
    transcript: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewCreate(BaseModel):
    rating: int
    text_review: Optional[str] = None
    voice_url: Optional[str] = None
    quality_rating: Optional[int] = None
    professionalism_rating: Optional[int] = None
    timeliness_rating: Optional[int] = None
    tags: Optional[str] = None   # comma-separated e.g. "On time,Clean work"

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError("Rating must be between 1 and 5")
        return v


class ReviewOut(BaseModel):
    id: int
    job_id: int
    customer_id: int
    worker_id: int
    rating: int
    text_review: Optional[str]
    voice_url: Optional[str]
    voice_transcript: Optional[str]
    quality_rating: Optional[int]
    professionalism_rating: Optional[int]
    timeliness_rating: Optional[int]
    tags: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
