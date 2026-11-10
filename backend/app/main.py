"""Roshan Rozgar — FastAPI application entry point.

Serves:
  • REST API  →  /api/v1/...
  • API docs  →  /docs  and  /redoc
  • Frontend  →  everything else (SPA fallback to index.html)
"""

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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
    allow_origins=["*"],        # single-origin setup — frontend served by same FastAPI
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Upload directories ────────────────────────────────────────────────────────
os.makedirs("uploads/voice", exist_ok=True)
os.makedirs("uploads/reviews", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ── API Routers ───────────────────────────────────────────────────────────────
from app.api.v1.router import api_router  # noqa: E402

app.include_router(api_router, prefix="/api/v1")

# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["health"])
async def health():
    from app.core.database import engine
    import sqlalchemy
    try:
        with engine.connect() as conn:
            conn.execute(sqlalchemy.text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {
        "status": "healthy",
        "database": db_status,
        "ai_configured": bool(settings.GEMINI_API_KEY),
        "version": "1.0.0",
    }

# ── Serve built React frontend ────────────────────────────────────────────────
# The dist folder is at ../../frontend/dist relative to this file
FRONTEND_DIST = Path(__file__).parent.parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    # Serve static assets (JS, CSS, images)
    app.mount(
        "/assets",
        StaticFiles(directory=str(FRONTEND_DIST / "assets")),
        name="frontend-assets",
    )

    @app.get("/favicon.svg", include_in_schema=False)
    async def favicon():
        f = FRONTEND_DIST / "favicon.svg"
        if f.exists():
            return FileResponse(str(f))
        return FileResponse(str(FRONTEND_DIST / "index.html"))

    @app.get("/", include_in_schema=False)
    async def root():
        return FileResponse(str(FRONTEND_DIST / "index.html"))

    # SPA catch-all — any route not matched above returns index.html
    # This must be LAST so it doesn't swallow API routes
    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str):
        # Don't intercept API or docs routes
        if full_path.startswith(("api/", "docs", "redoc", "uploads", "health")):
            from fastapi import HTTPException
            raise HTTPException(status_code=404)
        index = FRONTEND_DIST / "index.html"
        return FileResponse(str(index))
