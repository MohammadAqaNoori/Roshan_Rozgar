"""Roshan Rozgar — FastAPI application entry point."""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Roshan Rozgar API",
    description=(
        "Hyper-local marketplace connecting households with skilled trade workers in Pakistan. "
        "Built for CUI Tech Fest | AI Web Forge hackathon."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static file serving for uploaded audio ───────────────────────────────────
os.makedirs("uploads/voice", exist_ok=True)
os.makedirs("uploads/reviews", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
async def root():
    return {
        "name": "Roshan Rozgar API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "ai": "Gemini API" if settings.GEMINI_API_KEY else "NOT CONFIGURED",
    }

@app.get("/health", tags=["health"])
async def health():
    from app.core.database import engine
    try:
        with engine.connect() as conn:
            conn.execute(__import__("sqlalchemy").text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {
        "status": "healthy",
        "database": db_status,
        "ai_configured": bool(settings.GEMINI_API_KEY),
    }

# ── API Routers ───────────────────────────────────────────────────────────────
from app.api.v1.router import api_router  # noqa: E402

app.include_router(api_router, prefix="/api/v1")
