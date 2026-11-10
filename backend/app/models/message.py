"""Message model — communication between customer and worker on a job."""

import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class MessageType(str, enum.Enum):
    text = "text"
    voice = "voice"        # audio file
    transcript = "transcript"  # AI-transcribed voice message


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    type = Column(Enum(MessageType), default=MessageType.text)
    content = Column(Text, nullable=True)       # text content or transcript
    audio_url = Column(String(500), nullable=True)  # for voice messages

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="messages")
    sender = relationship("User", back_populates="messages")

    def __repr__(self):
        return f"<Message(id={self.id}, job_id={self.job_id}, type={self.type})>"
