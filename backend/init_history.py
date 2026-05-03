import sqlite3
import os

# Use absolute path for database
current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, 'history.db')

# Connect to a new or existing database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create the scan history table
cursor.execute('''
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    url TEXT NOT NULL,
    score INTEGER NOT NULL,
    status TEXT NOT NULL,
    time TEXT NOT NULL
)
''')

conn.commit()
conn.close()

print(f"✅ history table created at {db_path}")
