"""
Database seeding — creates demo workers, jobs, and reviews.
v2.0 — Localized for Afghanistan (Karigar)
All seeded data is clearly disclosed in README as required by competition rules.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.database import Base, engine, SessionLocal
from app.models.user import User, UserRole
from app.models.worker import Worker, Trade, WorkerStatus
from app.models.job import Job, JobStatus
from app.models.review import Review
from app.models.message import Message, MessageType


WORKERS = [
    {"name": "Ahmad Shah",       "nameUr": "احمد شاه",      "phone": "+93700111001", "trade": Trade.plumber,       "exp": 11, "area": "Shahr-e-Naw, Kabul",      "lat": 34.5260, "lng": 69.1781, "status": WorkerStatus.available, "rating": 4.8, "jobs": 128, "reviews": 112, "skills": "Leak repair,Geyser fitting,Bathroom fittings,Pipe replacement", "days": "Sat,Sun,Mon,Tue,Wed,Thu", "hours": "8 AM – 7 PM",  "bio": "۱۱ سال تجربه۔ کار لوله کشی خانگی و تجاری."},
    {"name": "Abdul Karim",       "nameUr": "عبدالکریم",     "phone": "+93700111002", "trade": Trade.electrician,   "exp": 14, "area": "Wazir Akbar Khan, Kabul", "lat": 34.5280, "lng": 69.1950, "status": WorkerStatus.available, "rating": 4.9, "jobs": 221, "reviews": 198, "skills": "House wiring,UPS & inverter,Fault finding,Solar panel", "days": "Sat,Sun,Mon,Tue,Wed,Thu,Fri", "hours": "7 AM – 9 PM",  "bio": "۱۴ سال تجربه. متخصص سیم کشی و پانل خورشیدی."},
    {"name": "Nasir Ahmad",       "nameUr": "نصیر احمد",     "phone": "+93700111003", "trade": Trade.ac_technician, "exp": 7,  "area": "Macroyan, Kabul",         "lat": 34.5200, "lng": 69.2050, "status": WorkerStatus.busy,      "rating": 4.6, "jobs": 84,  "reviews": 76,  "skills": "AC service,Gas refill,Installation,PCB repair", "days": "Sat,Sun,Mon,Tue,Wed", "hours": "9 AM – 7 PM",  "bio": "۷ سال تجربه. سرویس کولر و شارژ گاز."},
    {"name": "Habibullah",        "nameUr": "حبیب‌الله",     "phone": "+93700111004", "trade": Trade.carpenter,     "exp": 18, "area": "Khair Khana, Kabul",      "lat": 34.5450, "lng": 69.1650, "status": WorkerStatus.available, "rating": 4.7, "jobs": 65,  "reviews": 59,  "skills": "Door repair,Cupboards,Furniture polish,Locks & hinges", "days": "Sat,Sun,Mon,Tue,Wed,Thu", "hours": "8 AM – 6 PM",  "bio": "۱۸ سال تجربه. کار نجاری و مبلمان."},
    {"name": "Wahidullah",        "nameUr": "واحدالله",     "phone": "+93700111005", "trade": Trade.mason,         "exp": 15, "area": "Herat City, Herat",      "lat": 34.3482, "lng": 62.2041, "status": WorkerStatus.available, "rating": 4.8, "jobs": 95,  "reviews": 87,  "skills": "Brickwork,Plastering,Tiling,Concrete", "days": "Sat,Sun,Mon,Tue,Wed,Thu", "hours": "7 AM – 6 PM",  "bio": "۱۵ سال تجربه. کار معماری و بتون."},
    {"name": "Zarif Khan",        "nameUr": "ظریف خان",      "phone": "+93700111006", "trade": Trade.painter,       "exp": 9,  "area": "Mazar City, Mazar-i-Sharif", "lat": 36.7069, "lng": 67.1100, "status": WorkerStatus.offline,   "rating": 4.5, "jobs": 49,  "reviews": 44,  "skills": "Room paint,Seepage fix,Exterior,Polish & enamel", "days": "Sat,Sun,Mon,Tue,Wed", "hours": "8 AM – 5 PM",  "bio": "۹ سال تجربه. رنگ‌کاری و رطوبت."},
    {"name": "Omar Farooq",       "nameUr": "عمر فاروق",     "phone": "+93700111007", "trade": Trade.mechanic,      "exp": 10, "area": "Kandahar City, Kandahar", "lat": 31.6289, "lng": 65.7372, "status": WorkerStatus.available, "rating": 4.3, "jobs": 35,  "reviews": 31,  "skills": "Car service,Battery,Bike repair,Denting & painting", "days": "Sat,Sun,Mon,Tue,Wed,Thu", "hours": "9 AM – 8 PM",  "bio": "۱۰ سال تجربه. سرویس موتر و موترسایکل."},
    {"name": "Yusuf Rahimi",      "nameUr": "یوسف رحیمی",    "phone": "+93700111008", "trade": Trade.appliance,     "exp": 12, "area": "Karte Seh, Kabul",       "lat": 34.5100, "lng": 69.1700, "status": WorkerStatus.available, "rating": 4.6, "jobs": 60,  "reviews": 53,  "skills": "Fridge,Washing machine,Microwave,Water dispenser", "days": "Sat,Sun,Mon,Tue,Wed,Thu", "hours": "9 AM – 7 PM",  "bio": "۱۲ سال تجربه. تعمیر وسایل برقی."},
]

CUSTOMER = {
    "name": "Mariam Noori",
    "phone": "+93700100100",
}

SAMPLE_REVIEWS = [
    {"worker_idx": 0, "stars": 5, "text": "Repaired the leaking pipe quickly and cleaned up after. Very professional.", "tags": "Fixed first time,Clean work"},
    {"worker_idx": 0, "stars": 5, "text": "Replaced bathroom mixer as agreed. No surprises on price.", "tags": "Fair price"},
    {"worker_idx": 1, "stars": 5, "text": "Found the short circuit in minutes. Calm and careful work.", "tags": "Fixed first time"},
    {"worker_idx": 2, "stars": 5, "text": "AC cooling restored. He showed the gas pressure reading before and after.", "tags": "On time"},
    {"worker_idx": 3, "stars": 5, "text": "Fixed the broken door hinges perfectly. Very skilled ustad.", "tags": "Clean work"},
]


def seed_database():
    """Drop, recreate, and seed the database with demo data."""
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Seeding data...")

    db: Session = SessionLocal()
    try:
        # Customer
        cust_user = User(phone=CUSTOMER["phone"], name=CUSTOMER["name"], role=UserRole.customer)
        db.add(cust_user)
        db.flush()

        # Workers
        worker_objs = []
        for w in WORKERS:
            u = User(phone=w["phone"], name=w["name"], role=UserRole.worker)
            db.add(u)
            db.flush()

            worker = Worker(
                user_id=u.id,
                trade=w["trade"],
                experience_years=w["exp"],
                bio=w["bio"],
                skills=w["skills"],
                days=w["days"],
                hours=w["hours"],
                area_name=w["area"],
                lat=w["lat"],
                lng=w["lng"],
                status=w["status"],
                is_available=(w["status"] == WorkerStatus.available),
                rating_avg=w["rating"],
                total_jobs=w["jobs"],
                total_reviews=w["reviews"],
            )
            db.add(worker)
            db.flush()
            worker_objs.append(worker)

        # Completed job + reviews for top workers
        for rev in SAMPLE_REVIEWS:
            worker = worker_objs[rev["worker_idx"]]
            created_at = datetime.utcnow() - timedelta(days=10)
            completed_at = created_at + timedelta(hours=2)

            job = Job(
                customer_id=cust_user.id,
                worker_id=worker.id,
                title="Sample completed job",
                description="Seeded demo job",
                trade_required=worker.trade.value,
                area_name=worker.area_name,
                lat=worker.lat,
                lng=worker.lng,
                agreed_price=300.0,
                status=JobStatus.completed,
                created_at=created_at,
                completed_at=completed_at,
            )
            db.add(job)
            db.flush()

            # Chat messages
            db.add(Message(job_id=job.id, sender_id=cust_user.id, type=MessageType.text,
                           content="می‌توانید بیایید؟"))
            db.add(Message(job_id=job.id, sender_id=worker.user_id, type=MessageType.text,
                           content="بله، می‌توانم بیایم."))

            review = Review(
                job_id=job.id,
                customer_id=cust_user.id,
                worker_id=worker.id,
                rating=rev["stars"],
                text_review=rev["text"],
                tags=rev["tags"],
                created_at=completed_at + timedelta(hours=1),
            )
            db.add(review)

        db.commit()

        print("\n✅ Seed complete!")
        print(f"   Workers : {len(WORKERS)}")
        print(f"   Customer: 1 (Mariam Noori)")
        print(f"   Reviews : {len(SAMPLE_REVIEWS)}")
        print(f"\n   Customer phone: {CUSTOMER['phone']}")
        print(f"   Worker phone  : {WORKERS[0]['phone']} (Ahmad Shah)")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
