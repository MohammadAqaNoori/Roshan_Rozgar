"""Message model — chat between customer and worker on a job."""

import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Float
from sqlalchemy.orm import relationship

from app.core.database import Base


class MessageType(str, enum.Enum):
    text = "text"
    voice = "voice"
    offer = "offer"      # price offer card
    system = "system"    # system notification


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    type = Column(Enum(MessageType), default=MessageType.text)
    content = Column(Text, nullable=True)        # text content
    audio_url = Column(String(500), nullable=True)
    transcript = Column(Text, nullable=True)     # AI-transcribed voice
    offer_amount = Column(Float, nullable=True)  # for type=offer
    offer_note = Column(Text, nullable=True)     # for type=offer
    offer_state = Column(String(20), nullable=True)  # open|accepted|superseded

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="messages")
    sender = relationship("User", back_populates="messages")

    def __repr__(self):
        return f"<Message(id={self.id}, job_id={self.job_id}, type={self.type})>"
