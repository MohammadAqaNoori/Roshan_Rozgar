"""Gemini AI service — voice transcription, structured extraction, and translation.

This is the core AI integration. Every function here should perform work that
would genuinely break a user flow if removed.
"""

import json
from typing import Optional

from google import genai
from google.genai import types

from app.core.config import settings


def get_client() -> genai.Client:
    """Get Gemini client. Raises if API key not configured."""
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set in environment")
    return genai.Client(api_key=settings.GEMINI_API_KEY)


# ---------------------------------------------------------------------------
# 1. ONBOARDING — Extract worker profile from voice
# ---------------------------------------------------------------------------

PROFILE_EXTRACTION_PROMPT = """\
You are helping a skilled trade worker in Pakistan create a profile.
The user has spoken in Urdu or Roman Urdu. Transcribe and extract structured info.

Extract the following fields:
- name: the worker's name
- trade: one of [electrician, plumber, ac_technician, carpenter, mechanic, painter, mason, welder, other]
- experience_years: years of experience (integer)
- area_name: their local area/neighbourhood (e.g. "G-9, Islamabad")
- bio: a short 1-2 sentence description of their skills in simple Urdu

Return ONLY a JSON object, no markdown, no explanation:
{"name": "", "trade": "", "experience_years": 0, "area_name": "", "bio": ""}
"""


async def extract_profile_from_audio(audio_data: bytes, mime_type: str = "audio/webm") -> dict:
    """Transcribe a worker's voice and extract structured profile data.

    This removes the literacy barrier — worker speaks, AI fills the form.
    """
    client = get_client()

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(data=audio_data, mime_type=mime_type),
            PROFILE_EXTRACTION_PROMPT,
        ],
    )

    return _safe_json_parse(response.text)


# ---------------------------------------------------------------------------
# 2. COMMUNICATION — Transcribe voice messages
# ---------------------------------------------------------------------------

TRANSCRIPTION_PROMPT = """\
Transcribe this audio message. The speaker may use Urdu or Roman Urdu.
Return only the transcribed text, nothing else.
"""


async def transcribe_voice_message(audio_data: bytes, mime_type: str = "audio/webm") -> str:
    """Transcribe a voice message for in-app display.

    Lets users who can't type communicate via voice. The transcript
    also enables the other party to read if they prefer.
    """
    client = get_client()

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(data=audio_data, mime_type=mime_type),
            TRANSCRIPTION_PROMPT,
        ],
    )

    return response.text.strip()


# ---------------------------------------------------------------------------
# 3. JOB CREATION — Extract job details from customer voice
# ---------------------------------------------------------------------------

JOB_EXTRACTION_PROMPT = """\
A customer in Pakistan is describing a job they need done.
They may speak in Urdu or Roman Urdu. Extract:

- title: short job title (e.g. "AC repair", "Leaking pipe")
- description: what the customer described
- trade_required: one of [electrician, plumber, ac_technician, carpenter, mechanic, painter, mason, welder, other]

Return ONLY JSON:
{"title": "", "description": "", "trade_required": ""}
"""


async def extract_job_from_audio(audio_data: bytes, mime_type: str = "audio/webm") -> dict:
    """Customer describes their problem by voice, AI structures the job request."""
    client = get_client()

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(data=audio_data, mime_type=mime_type),
            JOB_EXTRACTION_PROMPT,
        ],
    )

    return _safe_json_parse(response.text)


# ---------------------------------------------------------------------------
# 4. TRUST — Transcribe voice reviews
# ---------------------------------------------------------------------------

REVIEW_PROMPT = """\
Transcribe this voice review from a customer in Pakistan.
They may speak in Urdu or Roman Urdu. Return only the transcribed text.
"""


async def transcribe_review(audio_data: bytes, mime_type: str = "audio/webm") -> str:
    """Transcribe a voice review so future customers can read it.

    Lets customers who can't type leave reviews by voice.
    """
    client = get_client()

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(data=audio_data, mime_type=mime_type),
            REVIEW_PROMPT,
        ],
    )

    return response.text.strip()


# ---------------------------------------------------------------------------
# 5. TRANSLATION — Urdu to English / Roman Urdu (optional, for display)
# ---------------------------------------------------------------------------

async def translate_urdu_to_english(text: str) -> str:
    """Translate Urdu text to English for admin/debugging purposes."""
    client = get_client()

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=f"Translate this Urdu text to English. Return only the translation:\n{text}",
    )

    return response.text.strip()


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _safe_json_parse(text: str) -> dict:
    """Safely parse JSON from Gemini response, handling markdown wrapping."""
    # Strip markdown code fences if present
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        cleaned = "\n".join(lines)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Return empty structure rather than crashing
        return {}
