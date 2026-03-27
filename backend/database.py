<<<<<<< HEAD
import sqlite3

# Connect database
conn = sqlite3.connect("database.db", check_same_thread=False)
cursor = conn.cursor()


def init_db():
    # ---------------- USERS TABLE ----------------
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # ---------------- PREDICTIONS TABLE ----------------
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        patient_name TEXT,
        patient_id TEXT,
        image_path TEXT,
        prediction TEXT,
        confidence REAL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # ---------------- DEFAULT ADMIN ----------------
    cursor.execute("""
    INSERT OR IGNORE INTO users (id, username, password, role)
    VALUES (1, 'admin', 'admin123', 'admin')
    """)

    conn.commit()


# Initialize database
=======
import sqlite3

# Connect database
conn = sqlite3.connect("database.db", check_same_thread=False)
cursor = conn.cursor()


def init_db():
    # ---------------- USERS TABLE ----------------
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # ---------------- PREDICTIONS TABLE ----------------
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        patient_name TEXT,
        patient_id TEXT,
        image_path TEXT,
        prediction TEXT,
        confidence REAL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # ---------------- DEFAULT ADMIN ----------------
    cursor.execute("""
    INSERT OR IGNORE INTO users (id, username, password, role)
    VALUES (1, 'admin', 'admin123', 'admin')
    """)

    conn.commit()


# Initialize database
>>>>>>> ab0992496abc4a5c90263659ff317c90d4560f18
init_db()