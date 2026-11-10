"""Database seeding — creates sample workers, jobs, and reviews for demo.

All seeded data is documented here and in the README. Judges know this is simulated.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.database import Base, engine, SessionLocal
from app.models.user import User, UserRole
from app.models.worker import Worker, Trade, WorkerStatus
from app.models.job import Job, JobStatus
from app.models.review import Review


SEED_WORKERS = [
    {
        "name": "Bilal Ahmed",
        "phone": "+923001111001",
        "trade": Trade.electrician,
        "experience_years": 12,
        "bio": "12 سال کا تجربہ۔ گھریلو اور تجارتی بجلی کا کام۔",
        "area_name": "G-9, Islamabad",
        "lat": 33.6844,
        "lng": 73.0479,
        "status": WorkerStatus.available,
        "rating_avg": 4.7,
        "total_jobs": 34,
        "total_reviews": 28,
    },
    {
        "name": "Riaz Hussain",
        "phone": "+923001111002",
        "trade": Trade.plumber,
        "experience_years": 8,
        "bio": "پلمبر۔ پانی کی ٹنکی،Pipe leakage،bathroom fittings۔",
        "area_name": "F-7, Islamabad",
        "lat": 33.7216,
        "lng": 73.0479,
        "status": WorkerStatus.available,
        "rating_avg": 4.5,
        "total_jobs": 22,
        "total_reviews": 19,
    },
    {
        "name": "Kamran Shah",
        "phone": "+923001111003",
        "trade": Trade.ac_technician,
        "experience_years": 6,
        "bio": "AC technician۔ servicing،gas refill،installation۔",
        "area_name": "I-8, Islamabad",
        "lat": 33.6557,
        "lng": 73.0256,
        "status": WorkerStatus.busy,
        "rating_avg": 4.3,
        "total_jobs": 15,
        "total_reviews": 12,
    },
    {
        "name": "Naveed Anwar",
        "phone": "+923001111004",
        "trade": Trade.carpenter,
        "experience_years": 15,
        "bio": "Carpenter۔ furniture repair،doors،cabinets۔",
        "area_name": "Rawalpindi, Saddar",
        "lat": 33.5973,
        "lng": 73.0479,
        "status": WorkerStatus.available,
        "rating_avg": 4.8,
        "total_jobs": 41,
        "total_reviews": 35,
    },
    {
        "name": "Asif Mehmood",
        "phone": "+923001111005",
        "trade": Trade.mechanic,
        "experience_years": 10,
        "bio": "Mechanic۔ generator repair،motor winding۔",
        "area_name": "Blue Area, Islamabad",
        "lat": 33.7078,
        "lng": 73.0479,
        "status": WorkerStatus.available,
        "rating_avg": 4.1,
        "total_jobs": 18,
        "total_reviews": 14,
    },
]

SEED_CUSTOMER = {
    "name": "Sana Malik",
    "phone": "+923001111099",
}

SEED_JOBS = [
    {
        "worker_idx": 0,
        "status": JobStatus.completed,
        "title": "Fan installation",
        "description": "Need ceiling fan installed in bedroom",
        "trade_required": "electrician",
        "agreed_price": 1500,
        "days_ago": 5,
        "rating": 5,
        "review_text": "Bohat acha kaam kiya. Time pe aya aur kaam complete kiya.",
    },
    {
        "worker_idx": 1,
        "status": JobStatus.completed,
        "title": "Leaking pipe fix",
        "description": "Kitchen pipe leaking under sink",
        "trade_required": "plumber",
        "agreed_price": 800,
        "days_ago": 2,
        "rating": 4,
        "review_text": "Good work, took a bit long but fixed the problem.",
    },
]


def seed_database():
    """Drop, recreate, and seed the database with demo data."""
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Seed customer
        customer = User(
            phone=SEED_CUSTOMER["phone"],
            name=SEED_CUSTOMER["name"],
            role=UserRole.customer,
        )
        db.add(customer)
        db.flush()

        # Seed workers
        worker_objs = []
        for w in SEED_WORKERS:
            user = User(
                phone=w["phone"],
                name=w["name"],
                role=UserRole.worker,
            )
            db.add(user)
            db.flush()

            worker = Worker(
                user_id=user.id,
                trade=w["trade"],
                experience_years=w["experience_years"],
                bio=w["bio"],
                area_name=w["area_name"],
                lat=w["lat"],
                lng=w["lng"],
                status=w["status"],
                is_available=w["status"] == WorkerStatus.available,
                rating_avg=w["rating_avg"],
                total_jobs=w["total_jobs"],
                total_reviews=w["total_reviews"],
            )
            db.add(worker)
            db.flush()
            worker_objs.append(worker)

        # Seed jobs and reviews
        for job_data in SEED_JOBS:
            worker = worker_objs[job_data["worker_idx"]]
            created = datetime.utcnow() - timedelta(days=job_data["days_ago"])
            completed = created + timedelta(hours=2)

            job = Job(
                customer_id=customer.id,
                worker_id=worker.id,
                title=job_data["title"],
                description=job_data["description"],
                trade_required=job_data["trade_required"],
                area_name=worker.area_name,
                lat=worker.lat,
                lng=worker.lng,
                agreed_price=job_data["agreed_price"],
                status=job_data["status"],
                created_at=created,
                completed_at=completed,
            )
            db.add(job)
            db.flush()

            review = Review(
                job_id=job.id,
                customer_id=customer.id,
                worker_id=worker.id,
                rating=job_data["rating"],
                text_review=job_data["review_text"],
                created_at=completed + timedelta(hours=1),
            )
            db.add(review)

        db.commit()
        print("Seed complete!")
        print(f"  - {len(SEED_WORKERS)} workers")
        print(f"  - 1 customer")
        print(f"  - {len(SEED_JOBS)} jobs with reviews")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
