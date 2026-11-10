"""Roshan Rozgar — FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


app = FastAPI(
    title="Roshan Rozgar API",
    description="Hyper-local marketplace for skilled trade workers in Pakistan",
    version="0.1.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "name": "Roshan Rozgar API",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


# --- Routers (imported after app creation to avoid circular imports) ---
from app.api.v1.router import api_router  # noqa: E402

app.include_router(api_router, prefix="/api/v1")
