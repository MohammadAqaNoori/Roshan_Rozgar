"""API v1 router — aggregates all endpoint routers."""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, workers, jobs, messages, reviews


api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(workers.router, prefix="/workers", tags=["workers"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
