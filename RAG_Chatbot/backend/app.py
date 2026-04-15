import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from rag_pipeline import answer_question

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for React frontend (defaulting to localhost:5173 typically)
CORS(app, resources={r"/api/*": {"origins": "*"}})

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
