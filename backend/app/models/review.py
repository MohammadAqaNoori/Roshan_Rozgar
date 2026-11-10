"""Review model — post-job feedback for trust building."""

from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False, unique=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=False)

    # Review content
    rating = Column(Integer, nullable=False)       # 1 to 5 stars
    text_review = Column(Text, nullable=True)      # optional typed review
    voice_url = Column(String(500), nullable=True) # optional voice review
    voice_transcript = Column(Text, nullable=True) # AI-transcribed voice review

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="review")
    customer = relationship("User", back_populates="reviews_given")
    worker = relationship("Worker", back_populates="reviews")

    def __repr__(self):
        return f"<Review(id={self.id}, rating={self.rating}, worker_id={self.worker_id})>"
