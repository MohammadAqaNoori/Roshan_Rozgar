"""Pydantic schemas for user-related requests and responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserCreate(BaseModel):
    phone: str
    role: str = "customer"


class UserOut(BaseModel):
    id: int
    phone: str
    name: Optional[str]
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"
