"""Job endpoints — create, negotiate, confirm, track."""

from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_customer
from app.models.job import Job, JobStatus
from app.models.user import User
from app.models.worker import Worker, WorkerStatus
from app.schemas.job import JobCreate, JobUpdate, JobOut
from app.services import gemini_service

router = APIRouter()


@router.post("/", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Customer posts a job request."""
    job = Job(
        customer_id=current_user.id,
        title=payload.title,
        description=payload.description,
        trade_required=payload.trade_required,
        area_name=payload.area_name,
        lat=payload.lat,
        lng=payload.lng,
        worker_id=payload.worker_id,
        scheduled_time=payload.scheduled_time,
        status=JobStatus.requested,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.post("/voice", response_model=dict)
async def create_job_from_voice(
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    AI-powered job creation.
    Customer describes their problem by voice in Urdu/Roman Urdu.
    Gemini extracts title, description, and trade_required.
    Returns extracted fields — frontend creates the job after user confirms.
    """
    audio_data = await audio.read()
    mime_type = audio.content_type or "audio/webm"

    extracted = await gemini_service.extract_job_from_audio(audio_data, mime_type)
    if not extracted:
        raise HTTPException(
            status_code=422,
            detail="Could not extract job details from audio. Please try again or type the problem."
        )

    return {
        "extracted": extracted,
        "ai_used": True,
        "note": "Review these details before submitting.",
    }


@router.get("/", response_model=List[JobOut])
def list_my_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List jobs for the current user (customer or worker)."""
    if current_user.role.value == "worker":
        worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
        if not worker:
            return []
        return (
            db.query(Job)
            .filter(Job.worker_id == worker.id)
            .order_by(Job.created_at.desc())
            .all()
        )
    return (
        db.query(Job)
        .filter(Job.customer_id == current_user.id)
        .order_by(Job.created_at.desc())
        .all()
    )


@router.get("/{job_id}", response_model=JobOut)
def get_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a single job. Only participants (customer or worker) can view."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Authorization: only the customer or assigned worker can view
    is_customer = job.customer_id == current_user.id
    worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
    is_worker = worker and job.worker_id == worker.id

    if not (is_customer or is_worker):
        raise HTTPException(status_code=403, detail="Not authorized to view this job")

    return job


@router.patch("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    payload: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update job — assign worker, set price, change status."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Assign worker
    if payload.worker_id is not None:
        worker = db.query(Worker).filter(Worker.id == payload.worker_id).first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        if worker.status != WorkerStatus.available:
            raise HTTPException(status_code=409, detail="Worker is not available")
        job.worker_id = payload.worker_id

    # Set agreed price
    if payload.agreed_price is not None:
        job.agreed_price = payload.agreed_price

    # Status transitions with side effects
    if payload.status is not None:
        new_status = JobStatus(payload.status)

        if new_status == JobStatus.confirmed:
            # Mark worker as busy — booking is locked
            if not job.worker_id:
                raise HTTPException(status_code=400, detail="Cannot confirm without a worker assigned")
            worker = db.query(Worker).filter(Worker.id == job.worker_id).first()
            if worker:
                if worker.status != WorkerStatus.available:
                    raise HTTPException(status_code=409, detail="Worker is no longer available")
                worker.status = WorkerStatus.busy
                worker.is_available = False

        elif new_status == JobStatus.completed:
            # Free the worker, increment job count
            if job.worker_id:
                worker = db.query(Worker).filter(Worker.id == job.worker_id).first()
                if worker:
                    worker.status = WorkerStatus.available
                    worker.is_available = True
                    worker.total_jobs = (worker.total_jobs or 0) + 1
            job.completed_at = datetime.utcnow()

        elif new_status == JobStatus.cancelled:
            # Free the worker if one was assigned
            if job.worker_id:
                worker = db.query(Worker).filter(Worker.id == job.worker_id).first()
                if worker and worker.status == WorkerStatus.busy:
                    worker.status = WorkerStatus.available
                    worker.is_available = True

        job.status = new_status

    db.commit()
    db.refresh(job)
    return job
