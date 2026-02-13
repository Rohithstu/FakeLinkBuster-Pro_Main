import sqlite3

# Connect to a new or existing database
conn = sqlite3.connect('history.db')
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

print("✅ history table created.")
