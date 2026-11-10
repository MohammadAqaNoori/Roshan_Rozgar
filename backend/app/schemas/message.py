"""Pydantic schemas for messaging."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class MessageOut(BaseModel):
    id: int
    job_id: int
    sender_id: int
    type: str
    content: Optional[str]
    audio_url: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewCreate(BaseModel):
    rating: int  # 1-5
    text_review: Optional[str] = None
    voice_url: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    job_id: int
    customer_id: int
    worker_id: int
    rating: int
    text_review: Optional[str]
    voice_url: Optional[str]
    voice_transcript: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
