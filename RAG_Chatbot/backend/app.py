import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from rag_pipeline import answer_question
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for React frontend (defaulting to localhost:5173 typically)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_FILE = "users.db"

def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )
        ''')
        conn.commit()

init_db()

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    
    if not username or not password or not role:
        return jsonify({"error": "Username, password, and role are required."}), 400
        
    hashed_password = generate_password_hash(password)
    
    try:
        with sqlite3.connect(DB_FILE) as conn:
            c = conn.cursor()
            c.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
                     (username, hashed_password, role))
            conn.commit()
        return jsonify({"message": "User created successfully", "username": username, "role": role}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists."}), 409

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400
        
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("SELECT password, role FROM users WHERE username = ?", (username,))
        user = c.fetchone()
        
    if user and check_password_hash(user[0], password):
        return jsonify({"message": "Login successful", "role": user[1], "username": username}), 200
    else:
        return jsonify({"error": "Invalid username or password."}), 401

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    if not data or "message" not in data or "role" not in data:
        return jsonify({"error": "Missing 'message' or 'role' in request body."}), 400

    user_message = data["message"]
    user_role = data["role"]

    # Check for API key (a friendly message)
    if not os.environ.get("GROQ_API_KEY"):
         return jsonify({"error": "GROQ_API_KEY is not configured on the backend. Please add it to the .env file."}), 500

    try:
        # Run standard generation chain
        response = answer_question(user_message, user_role)
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error processing question: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
