"""Message endpoints — job-scoped communication (text + voice)."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.message import Message, MessageType
from app.models.job import Job
from app.api.v1.endpoints.auth import _get_current_user
from app.schemas.message import MessageOut


router = APIRouter()


@router.get("/job/{job_id}", response_model=List[MessageOut])
def get_job_messages(
    job_id: int,
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """Get all messages in a job thread."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return db.query(Message).filter(Message.job_id == job_id).order_by(Message.created_at).all()


@router.post("/job/{job_id}/text", response_model=MessageOut, status_code=201)
def send_text_message(
    job_id: int,
    content: str,
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """Send a text message in a job thread."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    msg = Message(
        job_id=job_id,
        sender_id=user_id,
        type=MessageType.text,
        content=content,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.post("/job/{job_id}/voice", response_model=MessageOut, status_code=201)
async def send_voice_message(
    job_id: int,
    audio: UploadFile = File(...),
    user_id: int = Depends(_get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a voice message. AI transcription happens separately (see AI endpoint)."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # TODO: save audio file to storage and get URL
    audio_url = f"/uploads/voice/{job_id}_{user_id}.webm"  # placeholder

    msg = Message(
        job_id=job_id,
        sender_id=user_id,
        type=MessageType.voice,
        audio_url=audio_url,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
