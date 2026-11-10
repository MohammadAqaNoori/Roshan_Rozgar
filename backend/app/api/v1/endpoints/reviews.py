"""Review endpoints — post-job feedback for trust building."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.review import Review
from app.models.job import Job, JobStatus
from app.models.worker import Worker
from app.api.v1.endpoints.auth import _get_current_user
from app.schemas.message import ReviewCreate, ReviewOut


router = APIRouter()


@router.post("/job/{job_id}", response_model=ReviewOut, status_code=201)
def create_review(
    job_id: int,
    payload: ReviewCreate,
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """Customer leaves a review after job completion."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != JobStatus.completed:
        raise HTTPException(status_code=400, detail="Job must be completed before review")
    if job.customer_id != user_id:
        raise HTTPException(status_code=403, detail="Only the job customer can review")

    # Check no existing review
    existing = db.query(Review).filter(Review.job_id == job_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Review already exists for this job")

    if payload.rating < 1 or payload.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be 1-5")

    review = Review(
        job_id=job_id,
        customer_id=user_id,
        worker_id=job.worker_id,
        rating=payload.rating,
        text_review=payload.text_review,
        voice_url=payload.voice_url,
    )
    db.add(review)

    # Update worker aggregate rating
    if job.worker_id:
        worker = db.query(Worker).filter(Worker.id == job.worker_id).first()
        if worker:
            total = (worker.total_reviews or 0) + 1
            old_sum = (worker.rating_avg or 0) * (worker.total_reviews or 0)
            worker.rating_avg = (old_sum + payload.rating) / total
            worker.total_reviews = total

    db.commit()
    db.refresh(review)
    return review


@router.get("/worker/{worker_id}", response_model=List[ReviewOut])
def get_worker_reviews(worker_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a worker — trust signal for next customer."""
    return db.query(Review).filter(Review.worker_id == worker_id).order_by(Review.created_at.desc()).all()


@router.post("/job/{job_id}/voice", response_model=ReviewOut)
async def create_voice_review(
    job_id: int,
    rating: int,
    audio: UploadFile = File(...),
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """Voice review — audio uploaded, transcription handled by AI service."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != JobStatus.completed:
        raise HTTPException(status_code=400, detail="Job must be completed before review")

    # TODO: save audio, call Gemini for transcription
    audio_url = f"/uploads/reviews/{job_id}.webm"  # placeholder

    review = Review(
        job_id=job_id,
        customer_id=user_id,
        worker_id=job.worker_id,
        rating=rating,
        voice_url=audio_url,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
