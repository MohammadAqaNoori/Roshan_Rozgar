"""Message endpoints — text, voice, and price offers."""

import os
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.message import Message, MessageType
from app.models.job import Job
from app.models.user import User
from app.schemas.message import MessageOut
from app.services import gemini_service

router = APIRouter()

UPLOAD_DIR = "uploads/voice"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _check_job_access(job_id: int, current_user: User, db: Session) -> Job:
    """Verify the user is a participant in this job."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    from app.models.worker import Worker
    worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
    is_participant = (
        job.customer_id == current_user.id
        or (worker and job.worker_id == worker.id)
    )
    if not is_participant:
        raise HTTPException(status_code=403, detail="Not a participant in this job")
    return job


@router.get("/job/{job_id}", response_model=List[MessageOut])
def get_messages(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch all messages in a job thread, ordered oldest first."""
    _check_job_access(job_id, current_user, db)
    return (
        db.query(Message)
        .filter(Message.job_id == job_id)
        .order_by(Message.created_at)
        .all()
    )


@router.post("/job/{job_id}/text", response_model=MessageOut, status_code=201)
def send_text(
    job_id: int,
    content: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a plain text message."""
    _check_job_access(job_id, current_user, db)
    msg = Message(
        job_id=job_id,
        sender_id=current_user.id,
        type=MessageType.text,
        content=content,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.post("/job/{job_id}/voice", response_model=MessageOut, status_code=201)
async def send_voice(
    job_id: int,
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a voice message.
    Gemini automatically transcribes it so the other party can read it.
    """
    _check_job_access(job_id, current_user, db)

    # Save file
    ext = audio.filename.rsplit(".", 1)[-1] if audio.filename and "." in audio.filename else "webm"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    audio_data = await audio.read()

    with open(filepath, "wb") as f:
        f.write(audio_data)

    audio_url = f"/uploads/voice/{filename}"

    # Transcribe via Gemini
    transcript = None
    try:
        transcript = await gemini_service.transcribe_voice_message(
            audio_data, audio.content_type or "audio/webm"
        )
    except Exception:
        pass  # Transcription failure is non-fatal — voice note still delivered

    msg = Message(
        job_id=job_id,
        sender_id=current_user.id,
        type=MessageType.voice,
        audio_url=audio_url,
        transcript=transcript,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.post("/job/{job_id}/offer", response_model=MessageOut, status_code=201)
def send_offer(
    job_id: int,
    amount: float = Form(...),
    note: str = Form(""),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Send a price offer in the chat.
    Old open offers from the same sender are superseded automatically.
    """
    job = _check_job_access(job_id, current_user, db)

    # Supersede previous open offers from this sender
    db.query(Message).filter(
        Message.job_id == job_id,
        Message.sender_id == current_user.id,
        Message.type == MessageType.offer,
        Message.offer_state == "open",
    ).update({"offer_state": "superseded"})

    msg = Message(
        job_id=job_id,
        sender_id=current_user.id,
        type=MessageType.offer,
        offer_amount=amount,
        offer_note=note,
        offer_state="open",
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.patch("/job/{job_id}/offer/{msg_id}/accept", response_model=MessageOut)
def accept_offer(
    job_id: int,
    msg_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Accept a price offer.
    Updates the offer state and sets the job's agreed_price.
    """
    job = _check_job_access(job_id, current_user, db)

    offer_msg = db.query(Message).filter(
        Message.id == msg_id,
        Message.job_id == job_id,
        Message.type == MessageType.offer,
    ).first()

    if not offer_msg:
        raise HTTPException(status_code=404, detail="Offer not found")
    if offer_msg.offer_state != "open":
        raise HTTPException(status_code=409, detail="Offer is no longer open")

    # Mark all other open offers as superseded
    db.query(Message).filter(
        Message.job_id == job_id,
        Message.type == MessageType.offer,
        Message.offer_state == "open",
        Message.id != msg_id,
    ).update({"offer_state": "superseded"})

    offer_msg.offer_state = "accepted"

    # Update job status and price
    job.agreed_price = offer_msg.offer_amount
    from app.models.job import JobStatus
    job.status = JobStatus.negotiated

    db.commit()
    db.refresh(offer_msg)
    return offer_msg
