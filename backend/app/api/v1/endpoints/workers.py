"""Worker endpoints — profile CRUD, discovery (nearby), availability."""

import math
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_worker
from app.models.user import User
from app.models.worker import Worker, Trade, WorkerStatus
from app.schemas.worker import (
    WorkerCreate, WorkerProfileUpdate, WorkerStatusUpdate,
    WorkerOut, WorkerNearbyOut, WorkerWithUserOut,
)
from app.services import gemini_service

router = APIRouter()


# ── Discovery ────────────────────────────────────────────────────────────────

@router.get("/nearby", response_model=List[WorkerNearbyOut])
def find_nearby_workers(
    lat: float = Query(..., description="Customer latitude"),
    lng: float = Query(..., description="Customer longitude"),
    trade: Optional[str] = Query(None, description="Filter by trade e.g. plumber"),
    radius_km: float = Query(10.0, description="Search radius in km"),
    available_only: bool = Query(True, description="Only show available workers"),
    db: Session = Depends(get_db),
):
    """
    Discovery — find workers near a customer's location.
    Returns workers sorted by distance, with distance_km attached.
    """
    query = db.query(Worker)

    if available_only:
        query = query.filter(Worker.status == WorkerStatus.available)

    if trade:
        try:
            query = query.filter(Worker.trade == Trade(trade))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Unknown trade: {trade}")

    workers = query.all()

    results = []
    for w in workers:
        if w.lat is None or w.lng is None:
            continue
        dist = _haversine(lat, lng, w.lat, w.lng)
        if dist <= radius_km:
            out = WorkerNearbyOut.model_validate(w)
            out.distance_km = round(dist, 2)
            results.append(out)

    results.sort(key=lambda x: x.distance_km or float("inf"))
    return results


# ── Single worker ─────────────────────────────────────────────────────────────

@router.get("/me", response_model=WorkerWithUserOut)
def get_my_worker_profile(
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db),
):
    """Worker fetches their own profile."""
    worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found. Complete onboarding first.")
    return worker


@router.get("/{worker_id}", response_model=WorkerWithUserOut)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    """Get a worker's public profile by ID."""
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker


# ── Create / Update ───────────────────────────────────────────────────────────

@router.post("/", response_model=WorkerOut, status_code=201)
def create_worker_profile(
    payload: WorkerCreate,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db),
):
    """Create a worker profile after voice onboarding completes."""
    existing = db.query(Worker).filter(Worker.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Worker profile already exists")

    # Update user name if provided
    if payload.name:
        current_user.name = payload.name
        db.add(current_user)

    worker = Worker(
        user_id=current_user.id,
        trade=Trade(payload.trade) if payload.trade else None,
        experience_years=payload.experience_years,
        bio=payload.bio,
        area_name=payload.area_name,
        lat=payload.lat,
        lng=payload.lng,
        status=WorkerStatus.offline,
        is_available=False,
    )
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return worker


@router.patch("/me", response_model=WorkerOut)
def update_my_profile(
    payload: WorkerProfileUpdate,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db),
):
    """Worker updates their own profile fields."""
    worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    if payload.name is not None:
        current_user.name = payload.name
        db.add(current_user)

    update_data = payload.model_dump(exclude_unset=True, exclude={"name"})
    for field, value in update_data.items():
        setattr(worker, field, value)

    db.commit()
    db.refresh(worker)
    return worker


@router.patch("/me/status", response_model=WorkerOut)
def update_availability(
    payload: WorkerStatusUpdate,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db),
):
    """Worker toggles their availability (available / busy / offline)."""
    worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    # Cannot manually set busy if on a confirmed job (managed by job status)
    worker.status = WorkerStatus(payload.status)
    worker.is_available = payload.status == "available"
    db.commit()
    db.refresh(worker)
    return worker


# ── AI: Voice onboarding ──────────────────────────────────────────────────────

@router.post("/me/voice-onboard", response_model=dict)
async def voice_onboard(
    audio: UploadFile = File(..., description="Voice recording (webm/mp4/ogg)"),
    current_user: User = Depends(require_worker),
):
    """
    AI-powered voice onboarding.
    Worker speaks in Urdu/Roman Urdu — Gemini extracts structured profile data.
    Returns extracted fields for user to review before saving.
    """
    audio_data = await audio.read()
    mime_type = audio.content_type or "audio/webm"

    extracted = await gemini_service.extract_profile_from_audio(audio_data, mime_type)

    if not extracted:
        raise HTTPException(
            status_code=422,
            detail="Could not extract profile from audio. Please try again or type your details."
        )

    return {
        "extracted": extracted,
        "ai_used": True,
        "note": "Review these fields and confirm or edit before saving.",
    }


# ── Helper ────────────────────────────────────────────────────────────────────

def _haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
