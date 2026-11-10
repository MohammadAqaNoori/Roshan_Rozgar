"""Shared FastAPI dependencies — auth, current user."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User, UserRole

security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> int:
    """Extract and validate the JWT token, return the user id (int)."""
    token = credentials.credentials
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return int(user_id)


def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> User:
    """Return the full User object for the authenticated request."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")
    return user


def require_worker(current_user: User = Depends(get_current_user)) -> User:
    """Require the current user to be a worker."""
    if current_user.role != UserRole.worker:
        raise HTTPException(status_code=403, detail="Worker access only")
    return current_user


def require_customer(current_user: User = Depends(get_current_user)) -> User:
    """Require the current user to be a customer."""
    if current_user.role != UserRole.customer:
        raise HTTPException(status_code=403, detail="Customer access only")
    return current_user
