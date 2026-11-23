"""Auth endpoints — phone-based registration and login with JWT."""

import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token
from app.core.deps import get_current_user
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserLogin, UserOut, Token

router = APIRouter()


def normalise_phone(raw: str) -> str:
    """
    Normalise an Afghan phone number to E.164 format (+93XXXXXXXXX).
    Handles: 0700123456, 700123456, +93700123456, 93700123456
    This runs on both register and login so the stored number always
    matches the login number regardless of how the user typed it.
    """
    digits = re.sub(r'\D', '', raw)
    if digits.startswith('93') and len(digits) >= 11:
        return '+' + digits
    if digits.startswith('0'):
        return '+93' + digits[1:]
    return '+93' + digits


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """Register with phone + name + role. OTP verification is simulated."""
    phone = normalise_phone(payload.phone)

    existing = db.query(User).filter(User.phone == phone).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered",
        )

    user = User(
        phone=phone,  # always store normalised
        name=payload.name,
        role=UserRole(payload.role),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=str(user.id))
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Login with phone number (OTP simulated — any phone that exists works)."""
    phone = normalise_phone(payload.phone)

    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No account found for {phone}. Please register first.",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")

    token = create_access_token(subject=str(user.id))
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user's profile."""
    return current_user


@router.patch("/me/name", response_model=UserOut)
def update_name(
    name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the current user's display name."""
    current_user.name = name
    db.commit()
    db.refresh(current_user)
    return current_user
