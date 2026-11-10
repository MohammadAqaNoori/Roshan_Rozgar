"""
Database seeding — creates demo workers, jobs, and reviews.
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
    {"name": "Muhammad Imran",   "nameUr": "محمد عمران",   "phone": "+923001111001", "trade": Trade.plumber,       "exp": 12, "area": "G-11, Islamabad", "lat": 33.6844, "lng": 73.0479, "status": WorkerStatus.available, "rating": 4.8, "jobs": 142, "reviews": 126, "skills": "Leak repair,Geyser fitting,Bathroom fittings,Pipe replacement", "days": "Mon,Tue,Wed,Thu,Fri,Sat", "hours": "9 AM – 7 PM",  "bio": "12 سال کا تجربہ۔ گھریلو اور تجارتی پانی کا کام۔"},
    {"name": "Abdul Rehman",     "nameUr": "عبدالرحمٰن",   "phone": "+923001111002", "trade": Trade.electrician,   "exp": 15, "area": "G-10, Islamabad", "lat": 33.6750, "lng": 73.0350, "status": WorkerStatus.available, "rating": 4.9, "jobs": 236, "reviews": 210, "skills": "House wiring,UPS & inverter,Fault finding,Switchboard", "days": "Mon,Tue,Wed,Thu,Fri,Sat,Sun", "hours": "8 AM – 9 PM",  "bio": "15 سال کا تجربہ۔ گھریلو وائرنگ اور یو پی ایس کا ماہر۔"},
    {"name": "Shahid Mehmood",   "nameUr": "شاہد محمود",   "phone": "+923001111003", "trade": Trade.ac_technician, "exp": 8,  "area": "F-11, Islamabad", "lat": 33.6900, "lng": 73.0250, "status": WorkerStatus.busy,      "rating": 4.6, "jobs": 97,  "reviews": 88,  "skills": "AC service,Gas refill,Installation,PCB repair", "days": "Mon,Tue,Wed,Thu,Fri,Sat", "hours": "10 AM – 8 PM", "bio": "8 سال کا تجربہ۔ ہر برانڈ کے اے سی کی سروس اور گیس بھرنا۔"},
    {"name": "Bilal Ahmed",      "nameUr": "بلال احمد",    "phone": "+923001111004", "trade": Trade.plumber,       "exp": 5,  "area": "G-9, Islamabad",  "lat": 33.6700, "lng": 73.0600, "status": WorkerStatus.available, "rating": 4.4, "jobs": 35,  "reviews": 31,  "skills": "Tap & mixer,Water tank & pump,Leak repair", "days": "Mon,Tue,Wed,Thu,Fri", "hours": "9 AM – 6 PM",  "bio": "5 سال کا تجربہ۔ نلکے، ٹینکی اور موٹر کا کام۔"},
    {"name": "Naveed Akhtar",    "nameUr": "نوید اختر",    "phone": "+923001111005", "trade": Trade.carpenter,     "exp": 20, "area": "I-8, Islamabad",  "lat": 33.6557, "lng": 73.0256, "status": WorkerStatus.available, "rating": 4.7, "jobs": 70,  "reviews": 64,  "skills": "Door repair,Cupboards,Locks & hinges,Furniture polish", "days": "Mon,Tue,Wed,Thu,Fri,Sat", "hours": "9 AM – 6 PM",  "bio": "20 سال کا تجربہ۔ دروازے، الماری اور فرنیچر کا کام۔"},
    {"name": "Tariq Mehmood",    "nameUr": "طارق محمود",   "phone": "+923001111006", "trade": Trade.appliance,     "exp": 11, "area": "Satellite Town",  "lat": 33.5973, "lng": 73.0479, "status": WorkerStatus.available, "rating": 4.5, "jobs": 58,  "reviews": 52,  "skills": "Fridge,Washing machine,Microwave,Water dispenser", "days": "Mon,Tue,Wed,Thu,Fri,Sat", "hours": "10 AM – 7 PM", "bio": "11 سال کا تجربہ۔ فریج اور واشنگ مشین کی مرمت۔"},
    {"name": "Zahid Hussain",    "nameUr": "زاہد حسین",    "phone": "+923001111007", "trade": Trade.painter,       "exp": 10, "area": "Saddar, RWP",    "lat": 33.5900, "lng": 73.0450, "status": WorkerStatus.offline,   "rating": 4.5, "jobs": 44,  "reviews": 40,  "skills": "Room paint,Seepage fix,Exterior,Polish & enamel", "days": "Mon,Tue,Wed,Thu,Fri", "hours": "8 AM – 5 PM",  "bio": "10 سال کا تجربہ۔ کمرے کا رنگ اور سیلن کا علاج۔"},
    {"name": "Asif Ali",         "nameUr": "آصف علی",      "phone": "+923001111008", "trade": Trade.mechanic,      "exp": 9,  "area": "G-13, Islamabad", "lat": 33.6500, "lng": 73.0200, "status": WorkerStatus.available, "rating": 4.3, "jobs": 30,  "reviews": 27,  "skills": "Car service,Battery,Bike repair,Denting", "days": "Mon,Tue,Wed,Thu,Fri,Sat", "hours": "9 AM – 8 PM",  "bio": "9 سال کا تجربہ۔ گاڑی اور بائیک کی مرمت۔"},
]

CUSTOMER = {
    "name": "Ayesha Khan",
    "phone": "+923335550000",
}

SAMPLE_REVIEWS = [
    {"worker_idx": 0, "stars": 5, "text": "Fixed the geyser pipe in one visit. Cleaned up after himself.", "tags": "Fixed first time,Clean work"},
    {"worker_idx": 0, "stars": 5, "text": "Bathroom mixer replaced. Price was exactly as agreed in chat.", "tags": "Fair price"},
    {"worker_idx": 0, "stars": 4, "text": "Good work, came 40 minutes late but called ahead.", "tags": "Polite"},
    {"worker_idx": 1, "stars": 5, "text": "Found the short circuit in 10 minutes. Very calm and careful.", "tags": "Fixed first time"},
    {"worker_idx": 2, "stars": 5, "text": "AC cooling restored. Showed me the gas pressure reading.", "tags": "On time"},
    {"worker_idx": 4, "stars": 5, "text": "Kitchen cupboard hinges replaced. Doors close properly now.", "tags": "Clean work"},
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

        # Completed job + reviews for top 3 workers
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
                agreed_price=1200.0,
                status=JobStatus.completed,
                created_at=created_at,
                completed_at=completed_at,
            )
            db.add(job)
            db.flush()

            # Chat messages
            db.add(Message(job_id=job.id, sender_id=cust_user.id, type=MessageType.text,
                           content="Kya aap aa saktay hain?"))
            db.add(Message(job_id=job.id, sender_id=worker.user_id, type=MessageType.text,
                           content="Haan, main aa sakta hoon."))

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
        print(f"   Customer: 1 (Ayesha Khan)")
        print(f"   Reviews : {len(SAMPLE_REVIEWS)}")
        print(f"\n   Customer phone: {CUSTOMER['phone']}")
        print(f"   Worker phone  : {WORKERS[0]['phone']} (Muhammad Imran)")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
