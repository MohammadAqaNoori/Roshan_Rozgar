# Roshan Rozgar (روشن روزگار)

A hyper-local marketplace connecting households with nearby skilled trade workers in Pakistan's informal economy.

Built for **CUI Tech Fest | AI Web Forge** — COMSATS University Islamabad.

---

## Problem

Pakistan's informal workforce (72.1% of non-agricultural employment) — electricians, plumbers, AC technicians, carpenters, mechanics — find work through street-corner *addas* or word of mouth. Existing job portals assume literacy, typing ability, and CVs. Households can't reliably find a nearby, available, trustworthy worker.

## Five Required Outcomes

| Outcome | How we solve it |
|---|---|
| **Onboarding** | Worker speaks in Urdu/Roman Urdu → Gemini extracts structured profile. No form filling. |
| **Discovery** | Customer sees available workers on map (Leaflet + OSM) filtered by trade and radius. |
| **Communication** | Voice messages in job chat. Gemini transcribes for the other party. |
| **Booking** | Job confirmation locks worker as "busy". Platform tracks availability in real time. |
| **Trust** | Star rating + voice review (auto-transcribed by Gemini) shown on worker profile. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python 3.12 + FastAPI |
| Database | MySQL + SQLAlchemy (ORM) |
| Maps | Leaflet.js + OpenStreetMap |
| Auth | JWT (via python-jose + passlib) |
| AI | Google Gemini API (`gemini-2.0-flash`) |

## AI Services Used

- **Google Gemini API** (`gemini-2.0-flash`)
  - Voice transcription in Urdu and Roman Urdu
  - Structured profile extraction from worker voice onboarding
  - Structured job extraction from customer voice requests
  - Voice review transcription

> AI tools used for development assistance: Kiro (AI coding assistant).

---

## Project Structure

```
Roshan_Rozgar/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── core/
│   │   │   ├── config.py        # Settings from .env
│   │   │   ├── database.py      # SQLAlchemy engine + session
│   │   │   └── security.py      # JWT + password hashing
│   │   ├── models/              # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── worker.py
│   │   │   ├── job.py
│   │   │   ├── review.py
│   │   │   └── message.py
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── api/v1/endpoints/    # Route handlers
│   │   │   ├── auth.py
│   │   │   ├── workers.py
│   │   │   ├── jobs.py
│   │   │   ├── messages.py
│   │   │   └── reviews.py
│   │   └── services/
│   │       ├── gemini_service.py  # All AI integrations
│   │       └── seed.py            # Demo data seeding
│   ├── requirements.txt
│   ├── .env.example
│   ├── run.py                   # Dev server
│   └── seed.py                  # Seed runner
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── WorkerOnboarding.jsx  # Voice-first registration
    │   │   ├── WorkerDashboard.jsx
    │   │   ├── CustomerHome.jsx      # Voice job request
    │   │   ├── WorkerDiscovery.jsx   # Map + list
    │   │   ├── JobChat.jsx           # Voice messages
    │   │   ├── JobTracking.jsx
    │   │   └── ReviewPage.jsx        # Voice review
    │   ├── components/
    │   │   └── Layout.jsx
    │   └── api/
    │       └── client.js            # Axios instance + JWT
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env with your MySQL credentials and Gemini API key

# Seed demo data
python seed.py

# Start server
python run.py
# API docs: http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

npm install
npm run dev
# App: http://localhost:5173
```

---

## Seeded / Mocked Data

The following data is seeded for the demo (documented per competition rules):

**Workers (5 seeded):**
- Bilal Ahmed — Electrician, G-9 Islamabad, ★ 4.7
- Riaz Hussain — Plumber, F-7 Islamabad, ★ 4.5
- Kamran Shah — AC Technician, I-8 Islamabad, ★ 4.3 (busy)
- Naveed Anwar — Carpenter, Rawalpindi Saddar, ★ 4.8
- Asif Mehmood — Mechanic, Blue Area, ★ 4.1

**Customer (1 seeded):** Sana Malik

**Jobs (2 seeded with reviews):** Fan installation and leaking pipe fix.

**What is NOT mocked:**
- Worker discovery by GPS coordinates (Haversine calculation is real)
- Gemini voice transcription (live API calls)
- JWT authentication
- Job status state machine

---

## Known Limitations

- OTP-based phone verification is mocked (phone is used as identifier only)
- Payment processing is out of scope per competition rules
- Identity verification against government databases is out of scope
- Native mobile app is out of scope (web-only, mobile-responsive)
- Real-time messaging uses HTTP polling, not WebSockets

---

## Team

Representing **COMSATS University Islamabad** at CUI Tech Fest | AI Web Forge.

> All project-specific code written during the official hacking window.
> Open-source libraries credited above.
