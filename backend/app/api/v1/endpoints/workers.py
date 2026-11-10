"""Worker endpoints — profile CRUD, discovery, availability tracking."""

import math
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.worker import Worker, Trade, WorkerStatus
from app.schemas.worker import WorkerProfileUpdate, WorkerStatusUpdate, WorkerOut, WorkerNearbyOut

from app.api.v1.endpoints.auth import _get_current_user


router = APIRouter()


@router.get("/nearby", response_model=List[WorkerNearbyOut])
def find_nearby_workers(
    lat: float = Query(..., description="Customer location latitude"),
    lng: float = Query(..., description="Customer location longitude"),
    trade: str | None = Query(None, description="Filter by trade"),
    radius_km: float = Query(10, description="Search radius in km"),
    db: Session = Depends(get_db),
):
    """Discovery: find available workers within radius of customer."""
    query = db.query(Worker).filter(Worker.status == WorkerStatus.available)

    if trade:
        query = query.filter(Worker.trade == Trade(trade))

    workers = query.all()

    # Haversine distance filter
    results = []
    for w in workers:
        if w.lat is None or w.lng is None:
            continue
        dist = haversine(lat, lng, w.lat, w.lng)
        if dist <= radius_km:
            results.append(WorkerNearbyOut.model_validate(w).model_copy(
                update={"distance_km": round(dist, 2)}
            ))

    # Sort by distance
    results.sort(key=lambda x: x.distance_km or float("inf"))
    return results


@router.get("/{worker_id}", response_model=WorkerOut)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    """Get a single worker's public profile (for trust / discovery)."""
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker


@router.put("/profile", response_model=WorkerOut)
def update_my_profile(
    payload: WorkerProfileUpdate,
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """Worker updates their profile (may be called after AI extracts data from voice)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role.value != "worker":
        raise HTTPException(status_code=403, detail="Only workers can update worker profiles")

    worker = db.query(Worker).filter(Worker.user_id == user_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "name":
            user.name = value
        elif value is not None:
            setattr(worker, field, value)

    db.commit()
    db.refresh(worker)
    return worker


@router.put("/status", response_model=WorkerOut)
def update_availability(
    payload: WorkerStatusUpdate,
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """Worker toggles availability (available / busy / offline)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role.value != "worker":
        raise HTTPException(status_code=403, detail="Only workers can update availability")

    worker = db.query(Worker).filter(Worker.user_id == user_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    worker.status = WorkerStatus(payload.status)
    worker.is_available = payload.status == "available"
    db.commit()
    db.refresh(worker)
    return worker


def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two lat/lng points in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
