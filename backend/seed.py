"""
Database initialization script.
This script:
1. Creates the MySQL database if it does not exist (provided sufficient permissions exist)
2. Creates the tables
3. Imports data for 100 books from `data/books.csv` and 20 users from `data/users.csv`
   (Each user's password is their national ID number, stored as a hash)

Execution: `python seed.py`
"""
import os
import sys
import pandas as pd
import pymysql
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "library_db")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def ensure_database_exists():
    """Connect without selecting a specific database and create it if it doesn't exist"""
    conn = pymysql.connect(host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PASSWORD)
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` "
                f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
        conn.commit()
        print(f"✔ Database '{DB_NAME}' is ready.")
    finally:
        conn.close()


def seed_data():
    sys.path.insert(0, BASE_DIR)
    from app.database import SessionLocal, Base, engine
    from app import models, auth

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # ---------- Books ----------
        if db.query(models.Book).count() == 0:
            books_df = pd.read_csv(os.path.join(BASE_DIR, "data", "books.csv"), dtype=str)
            for _, row in books_df.iterrows():
                book = models.Book(
                    title=row["title"],
                    author=row["author"],
                    publish_year=str(row["publish_year"]),
                    is_available=True,
                )
                db.add(book)
            db.commit()
            print(f"✔ {len(books_df)} books imported.")
        else:
            print("… Books already exist in the database; skipping this step.")

        # ---------- Users ----------
        if db.query(models.User).count() == 0:
            users_df = pd.read_csv(os.path.join(BASE_DIR, "data", "users.csv"), dtype=str)
            for _, row in users_df.iterrows():
                national_code = str(row["national_code"])
                user = models.User(
                    full_name=row["full_name"],
                    national_code=national_code,
                    # According to the website design, each user's initial password is their National ID number.
                    hashed_password=auth.get_password_hash(national_code),
                )
                db.add(user)
            db.commit()
            print(f"✔ {len(users_df)} users imported.")
        else:
            print("… Users already exist in the database; skipping this step.")

    finally:
        db.close()


if __name__ == "__main__":
    ensure_database_exists()
    seed_data()
    print("\nDatabase initialization completed successfully.")
