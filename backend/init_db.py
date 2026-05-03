import sqlite3
import os

# Use absolute path for database
current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, 'users.db')

# Connect to the database (or create it)
conn = sqlite3.connect(db_path)

# Create a cursor
cursor = conn.cursor()

# Create the users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
''')

# Commit and close
conn.commit()
conn.close()

print(f"Database and users table created at {db_path}")
