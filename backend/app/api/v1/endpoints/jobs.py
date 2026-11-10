"""Job endpoints — create, negotiate, confirm, and track jobs."""

from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.job import Job, JobStatus
from app.models.user import User
from app.models.worker import Worker, WorkerStatus
from app.schemas.job import JobCreate, JobUpdate, JobOut
from app.api.v1.endpoints.auth import _get_current_user


router = APIRouter()


@router.post("/", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """Customer posts a job request."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    job = Job(
        customer_id=user_id,
        title=payload.title,
        description=payload.description,
        trade_required=payload.trade_required,
        area_name=payload.area_name,
        lat=payload.lat,
        lng=payload.lng,
        scheduled_time=payload.scheduled_time,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    """Get job details."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/", response_model=List[JobOut])
def list_my_jobs(
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """List jobs for the current user (as customer or worker)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role.value == "worker":
        worker = db.query(Worker).filter(Worker.user_id == user_id).first()
        if not worker:
            return []
        return db.query(Job).filter(Job.worker_id == worker.id).all()

    return db.query(Job).filter(Job.customer_id == user_id).all()


@router.put("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    payload: JobUpdate,
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """Negotiate and confirm a job — assign worker, set price, change status."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if payload.worker_id is not None:
        worker = db.query(Worker).filter(Worker.id == payload.worker_id).first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        if worker.status != WorkerStatus.available:
            raise HTTPException(status_code=400, detail="Worker is not available")
        job.worker_id = payload.worker_id

    if payload.agreed_price is not None:
        job.agreed_price = payload.agreed_price

    if payload.status is not None:
        new_status = JobStatus(payload.status)

        # When confirming: mark worker as busy
        if new_status == JobStatus.confirmed and job.worker_id:
            worker = db.query(Worker).filter(Worker.id == job.worker_id).first()
            if worker:
                worker.status = WorkerStatus.busy
                worker.is_available = False

        # When completing: mark worker available again, increment total_jobs
        if new_status == JobStatus.completed and job.worker_id:
            worker = db.query(Worker).filter(Worker.id == job.worker_id).first()
            if worker:
                worker.status = WorkerStatus.available
                worker.is_available = True
                worker.total_jobs = (worker.total_jobs or 0) + 1
            job.completed_at = datetime.utcnow()

        job.status = new_status

    db.commit()
    db.refresh(job)
    return job
