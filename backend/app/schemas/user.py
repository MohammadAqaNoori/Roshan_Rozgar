"""Pydantic schemas for user-related requests and responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class UserCreate(BaseModel):
    phone: str
    name: Optional[str] = None
    role: str = "customer"

    @field_validator("role")
    @classmethod
    def validate_role(cls, v):
        if v not in ("customer", "worker"):
            raise ValueError("role must be 'customer' or 'worker'")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        # Strip all non-digit characters for length check
        digits = "".join(c for c in v if c.isdigit())
        # Afghan numbers: local (10 digits with 0) or E.164 (+93 + 9 digits = 11 digits)
        # We normalise to E.164 in auth.py before storing, so digits here = 11 (93 + 9)
        if len(digits) < 9:
            raise ValueError("Phone number too short — Afghan numbers are 9-10 digits")
        if len(digits) > 12:
            raise ValueError("Phone number too long")
        return v.strip()


class UserLogin(BaseModel):
    phone: str


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
    user: UserOut
