"""Review endpoints — post-job trust building."""

import os
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_customer
from app.models.review import Review
from app.models.job import Job, JobStatus
from app.models.worker import Worker
from app.models.user import User
from app.schemas.message import ReviewCreate, ReviewOut
from app.services import gemini_service

router = APIRouter()

UPLOAD_DIR = "uploads/reviews"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/job/{job_id}", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
    job_id: int,
    payload: ReviewCreate,
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    """Customer submits a review after a completed job."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the job's customer can review")
    if job.status not in (JobStatus.completed, JobStatus.cancelled):
        raise HTTPException(status_code=400, detail="Job must be completed before reviewing")

    existing = db.query(Review).filter(Review.job_id == job_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Review already submitted for this job")

    review = Review(
        job_id=job_id,
        customer_id=current_user.id,
        worker_id=job.worker_id,
        rating=payload.rating,
        text_review=payload.text_review,
        voice_url=payload.voice_url,
        quality_rating=payload.quality_rating,
        professionalism_rating=payload.professionalism_rating,
        timeliness_rating=payload.timeliness_rating,
        tags=payload.tags,
    )
    db.add(review)

    # Update worker aggregate rating
    if job.worker_id:
        worker = db.query(Worker).filter(Worker.id == job.worker_id).first()
        if worker:
            total = (worker.total_reviews or 0) + 1
            old_sum = (worker.rating_avg or 0.0) * (worker.total_reviews or 0)
            worker.rating_avg = round((old_sum + payload.rating) / total, 2)
            worker.total_reviews = total

    db.commit()
    db.refresh(review)
    return review


@router.post("/job/{job_id}/voice", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def create_voice_review(
    job_id: int,
    rating: int,
    audio: UploadFile = File(...),
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    """
    Voice review — customer speaks instead of typing.
    Gemini transcribes the audio and stores it alongside the voice file.
    Both the audio URL and the transcript are saved for future customers.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the job's customer can review")
    if job.status not in (JobStatus.completed, JobStatus.cancelled):
        raise HTTPException(status_code=400, detail="Job must be completed before reviewing")

    existing = db.query(Review).filter(Review.job_id == job_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Review already submitted for this job")

    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be 1–5")

    # Save audio
    ext = audio.filename.rsplit(".", 1)[-1] if audio.filename and "." in audio.filename else "webm"
    filename = f"review_{job_id}_{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    audio_data = await audio.read()

    with open(filepath, "wb") as f:
        f.write(audio_data)

    audio_url = f"/uploads/reviews/{filename}"

    # Transcribe via Gemini — this is the AI that removes the literacy barrier
    transcript = None
    try:
        transcript = await gemini_service.transcribe_review(
            audio_data, audio.content_type or "audio/webm"
        )
    except Exception:
        pass

    review = Review(
        job_id=job_id,
        customer_id=current_user.id,
        worker_id=job.worker_id,
        rating=rating,
        voice_url=audio_url,
        voice_transcript=transcript,
    )
    db.add(review)

    # Update worker rating
    if job.worker_id:
        worker = db.query(Worker).filter(Worker.id == job.worker_id).first()
        if worker:
            total = (worker.total_reviews or 0) + 1
            old_sum = (worker.rating_avg or 0.0) * (worker.total_reviews or 0)
            worker.rating_avg = round((old_sum + rating) / total, 2)
            worker.total_reviews = total

    db.commit()
    db.refresh(review)
    return review


@router.get("/worker/{worker_id}", response_model=List[ReviewOut])
def get_worker_reviews(worker_id: int, db: Session = Depends(get_db)):
    """Public — get all reviews for a worker, newest first."""
    return (
        db.query(Review)
        .filter(Review.worker_id == worker_id)
        .order_by(Review.created_at.desc())
        .all()
    )
