import sqlite3

# Connect to the database (or create it)
conn = sqlite3.connect('users.db')

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

print("Database and users table created.")
