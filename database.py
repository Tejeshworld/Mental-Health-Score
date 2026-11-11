"""
MindSpace – SQLite Database & Authentication Layer
Built with Python standard library (sqlite3, hashlib, secrets, datetime, re).
Zero external dependencies, persistent, secure PBKDF2-HMAC-SHA256 hashing.
"""

import sqlite3
import hashlib
import secrets
import os
import re
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "mindspace.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # Users Table with student details
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        student_age INTEGER NOT NULL,
        college_name TEXT NOT NULL,
        academic_class TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Migration check for existing databases
    cur.execute("PRAGMA table_info(users)")
    columns = [row['name'] for row in cur.fetchall()]

    # If old schema without new columns, add them safely
    if 'student_name' not in columns:
        cur.execute("ALTER TABLE users ADD COLUMN student_name TEXT DEFAULT ''")
        # Populate from legacy full_name if present
        if 'full_name' in columns:
            cur.execute("UPDATE users SET student_name = full_name WHERE student_name = '' OR student_name IS NULL")
    if 'student_age' not in columns:
        cur.execute("ALTER TABLE users ADD COLUMN student_age INTEGER DEFAULT 18")
    if 'college_name' not in columns:
        cur.execute("ALTER TABLE users ADD COLUMN college_name TEXT DEFAULT ''")
        if 'college' in columns:
            cur.execute("UPDATE users SET college_name = college WHERE college_name = '' OR college_name IS NULL")
    if 'academic_class' not in columns:
        cur.execute("ALTER TABLE users ADD COLUMN academic_class TEXT DEFAULT '1st Year'")
    if 'phone_number' not in columns:
        cur.execute("ALTER TABLE users ADD COLUMN phone_number TEXT DEFAULT ''")
    if 'updated_at' not in columns:
        cur.execute("ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NULL")
        cur.execute("UPDATE users SET updated_at = datetime('now') WHERE updated_at IS NULL")

    # Active Auth Tokens / Sessions
    cur.execute("""
    CREATE TABLE IF NOT EXISTS tokens (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # Assessments Table (Connected to Student)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        predicted_score REAL NOT NULL,
        age INTEGER,
        gender TEXT,
        country TEXT,
        academic_level TEXT,
        most_used_platform TEXT,
        purpose_of_use TEXT,
        avg_daily_usage_hours REAL,
        daily_unlocks INTEGER,
        study_hours REAL,
        physical_activity_hours REAL,
        sleep_hours_per_night REAL,
        stress_level TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # Password Reset Tokens
    cur.execute("""
    CREATE TABLE IF NOT EXISTS password_resets (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    conn.commit()
    conn.close()


# ── Password Hashing ──────────────────────────────────────────────────────────

def hash_password(password: str, salt: str = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return key.hex(), salt


def verify_password(password: str, password_hash: str, salt: str) -> bool:
    new_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(new_hash, password_hash)


def is_valid_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return bool(re.match(pattern, email.strip()))


def is_valid_phone(phone: str) -> bool:
    # Allows international format with +, brackets, spaces, hyphens, and at least 7 digits
    clean_digits = re.sub(r'\D', '', phone)
    pattern = r'^\+?[0-9\s\-().]{7,25}$'
    return bool(re.match(pattern, phone.strip())) and (7 <= len(clean_digits) <= 18)


VALID_ACADEMIC_CLASSES = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
    "Class 11", "Class 12",
    "1st Year", "2nd Year", "3rd Year", "4th Year",
    "MBMS 1st Year", "MBMS 2nd Year", "MBMS 3rd Year", "MBMS 4th Year", "MBMS 5th Year"
]


# ── User Registration & Authentication ────────────────────────────────────────

def create_user(student_name: str, student_age: int, college_name: str,
                academic_class: str, phone_number: str, email: str, password: str):
    clean_name = student_name.strip()
    clean_college = college_name.strip()
    clean_class = academic_class.strip()
    clean_phone = phone_number.strip()
    clean_email = email.strip().lower()

    if not clean_name:
        raise ValueError("Student Name is required.")
    if student_age is None or not (5 <= int(student_age) <= 100):
        raise ValueError("Student Age must be a valid number between 5 and 100.")
    if not clean_college:
        raise ValueError("School / College Name is required.")
    if not clean_class:
        raise ValueError("Class / Academic Year is required.")
    if not is_valid_phone(clean_phone):
        raise ValueError("Please provide a valid Phone Number (supports international country codes).")
    if not is_valid_email(clean_email):
        raise ValueError("Please provide a valid Email ID.")
    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters long.")

    pwd_hash, salt = hash_password(password)

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
        INSERT INTO users (
            student_name, full_name, student_age, college_name, college, academic_class,
            phone_number, email, password_hash, salt, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (
            clean_name,
            clean_name,
            int(student_age),
            clean_college,
            clean_college,
            clean_class,
            clean_phone,
            clean_email,
            pwd_hash,
            salt
        ))
        conn.commit()
        user_id = cur.lastrowid
        return get_user_by_id(user_id)
    except sqlite3.IntegrityError as e:
        if "email" in str(e).lower() or "unique" in str(e).lower():
            raise ValueError("An account with this Email ID already exists. Please sign in.")
        raise ValueError(f"Registration failed: {str(e)}")
    finally:
        conn.close()


def authenticate_user(email: str, password: str):
    clean_email = email.strip().lower()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = ?", (clean_email,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return None
    if not verify_password(password, row['password_hash'], row['salt']):
        return None

    return get_user_by_id(row['id'])


def create_session(user_id: int, days_valid: int = 30) -> str:
    token = secrets.token_urlsafe(32)
    expires_at = (datetime.utcnow() + timedelta(days=days_valid)).strftime('%Y-%m-%d %H:%M:%S')

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO tokens (token, user_id, expires_at)
    VALUES (?, ?, ?)
    """, (token, user_id, expires_at))
    conn.commit()
    conn.close()
    return token


def _format_user_dict(row: sqlite3.Row) -> dict:
    d = dict(row)
    # Ensure student_name is aliased as full_name for backward compatibility
    if 'student_name' in d and ('full_name' not in d or not d['full_name']):
        d['full_name'] = d['student_name']
    if 'college_name' in d and ('college' not in d or not d['college']):
        d['college'] = d['college_name']
    return d


def get_user_by_token(token: str):
    if not token:
        return None
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    SELECT u.id, u.student_name, u.student_age, u.college_name, u.academic_class,
           u.phone_number, u.email, u.created_at, u.updated_at
    FROM tokens t
    JOIN users u ON t.user_id = u.id
    WHERE t.token = ? AND t.expires_at > datetime('now')
    """, (token,))
    row = cur.fetchone()
    conn.close()
    if row:
        return _format_user_dict(row)
    return None


def get_user_by_id(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    SELECT id, student_name, student_age, college_name, academic_class,
           phone_number, email, created_at, updated_at
    FROM users WHERE id = ?
    """, (user_id,))
    row = cur.fetchone()
    conn.close()
    if row:
        return _format_user_dict(row)
    return None


def revoke_token(token: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM tokens WHERE token = ?", (token,))
    conn.commit()
    conn.close()


def update_profile(user_id: int, student_name: str, student_age: int,
                   college_name: str, academic_class: str, phone_number: str):
    clean_name = student_name.strip()
    clean_college = college_name.strip()
    clean_class = academic_class.strip()
    clean_phone = phone_number.strip()

    if not clean_name:
        raise ValueError("Student Name cannot be empty.")
    if student_age is None or not (5 <= int(student_age) <= 100):
        raise ValueError("Student Age must be between 5 and 100.")
    if not clean_college:
        raise ValueError("School / College Name cannot be empty.")
    if not clean_class:
        raise ValueError("Class / Academic Year cannot be empty.")
    if not is_valid_phone(clean_phone):
        raise ValueError("Please enter a valid Phone Number.")

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    UPDATE users
    SET student_name = ?,
        full_name = ?,
        student_age = ?,
        college_name = ?,
        college = ?,
        academic_class = ?,
        phone_number = ?,
        updated_at = datetime('now')
    WHERE id = ?
    """, (
        clean_name,
        clean_name,
        int(student_age),
        clean_college,
        clean_college,
        clean_class,
        clean_phone,
        user_id
    ))
    conn.commit()
    conn.close()
    return get_user_by_id(user_id)


# ── Assessment History Persistence ───────────────────────────────────────────

def save_assessment(user_id: int, data: dict, predicted_score: float):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO assessments (
        user_id, predicted_score, age, gender, country, academic_level,
        most_used_platform, purpose_of_use, avg_daily_usage_hours,
        daily_unlocks, study_hours, physical_activity_hours,
        sleep_hours_per_night, stress_level, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    """, (
        user_id,
        predicted_score,
        data.get('age'),
        data.get('gender'),
        data.get('country'),
        data.get('academic_level'),
        data.get('most_used_platform'),
        data.get('purpose_of_use'),
        data.get('avg_daily_usage_hours'),
        data.get('daily_unlocks'),
        data.get('study_hours'),
        data.get('physical_activity_hours'),
        data.get('sleep_hours_per_night'),
        data.get('stress_level')
    ))
    conn.commit()
    assessment_id = cur.lastrowid
    conn.close()
    return assessment_id


def get_user_wellbeing_activity(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    # Total count
    cur.execute("SELECT COUNT(*) as count FROM assessments WHERE user_id = ?", (user_id,))
    total_count = cur.fetchone()['count']

    # Latest record
    cur.execute("""
    SELECT * FROM assessments
    WHERE user_id = ?
    ORDER BY created_at DESC LIMIT 1
    """, (user_id,))
    latest_row = cur.fetchone()
    latest = dict(latest_row) if latest_row else None

    # History list (last 10)
    cur.execute("""
    SELECT id, predicted_score, most_used_platform, avg_daily_usage_hours,
           study_hours, sleep_hours_per_night, stress_level, created_at
    FROM assessments
    WHERE user_id = ?
    ORDER BY created_at DESC LIMIT 10
    """, (user_id,))
    history = [dict(r) for r in cur.fetchall()]

    conn.close()

    return {
        "completed_assessments": total_count,
        "latest_assessment_date": latest['created_at'] if latest else None,
        "latest_predicted_score": latest['predicted_score'] if latest else None,
        "history": history
    }


# ── Password Reset Flow ───────────────────────────────────────────────────────

def create_password_reset(email: str):
    clean_email = email.strip().lower()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE email = ?", (clean_email,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return None

    user_id = row['id']
    token = secrets.token_hex(20)
    expires_at = (datetime.utcnow() + timedelta(hours=2)).strftime('%Y-%m-%d %H:%M:%S')

    cur.execute("DELETE FROM password_resets WHERE user_id = ?", (user_id,))
    cur.execute("""
    INSERT INTO password_resets (token, user_id, expires_at)
    VALUES (?, ?, ?)
    """, (token, user_id, expires_at))
    conn.commit()
    conn.close()

    return token


def reset_password_with_token(token: str, new_password: str):
    if len(new_password) < 6:
        raise ValueError("Password must be at least 6 characters long.")

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    SELECT user_id FROM password_resets
    WHERE token = ? AND expires_at > datetime('now')
    """, (token.strip(),))
    row = cur.fetchone()
    if not row:
        conn.close()
        raise ValueError("Invalid or expired password reset token.")

    user_id = row['user_id']
    pwd_hash, salt = hash_password(new_password)

    cur.execute("UPDATE users SET password_hash = ?, salt = ?, updated_at = datetime('now') WHERE id = ?", (pwd_hash, salt, user_id))
    cur.execute("DELETE FROM password_resets WHERE user_id = ?", (user_id,))
    cur.execute("DELETE FROM tokens WHERE user_id = ?", (user_id,))  # revoke existing sessions
    conn.commit()
    conn.close()
    return True


# Automatically initialize tables and execute migrations on import
init_db()
