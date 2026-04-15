# FinTechX: Role-Based LLM-Powered Company Assistant

FinTechX is a sophisticated RAG (Retrieval-Augmented Generation) chatbot designed to serve as an organizational intelligence layer. It implements **Role-Based Access Control (RBAC)** to ensure that users only retrieve information pertinent to their specific department or general company updates.

## 🚀 Features

- **Department-Specific Retrieval**: Data is isolated into Marketing, HR, Finance, Engineering, and General categories.
- **RBAC Security**: Users gain access based on their assigned role; for example, a "Marketing" user cannot access "HR" or "Finance" data.
- **High-Performance RAG**: Built using LangChain LCEL for a fast and modular retrieval pipeline.
- **Premium UI**: A modern React-based interface with markdown support for structured technical responses.
- **Advanced LLM**: Powered by **Llama 3.1 (via Groq)** for rapid, high-quality reasoning.

## 🛠️ Tech Stack

- **Large Language Model**: Groq (Llama 3.1 8B)
- **Vector Database**: ChromaDB
- **Embeddings**: HuggingFace (`all-MiniLM-L6-v2`)
- **Backend Framework**: Python Flask
- **Pipeline Orchestration**: LangChain (LCEL)
- **Frontend Framework**: React (Vite)

## 📂 Project Structure

```text
├── Data/                   # Domain-specific documents (Engineering, HR, etc.)
├── RAG_Chatbot/
│   ├── backend/            # Flask API & RAG Pipeline
│   │   ├── app.py          # Main API Entry Point
│   │   ├── ingest.py       # Data Ingestion Script (Vector Store Creator)
│   │   ├── rag_pipeline.py # Core LangChain Retrieval Logic
│   │   └── requirements.txt
│   └── frontend/           # React Frontend (Vite)
│       ├── src/
│       └── package.json
└── README.md
```

## ⚙️ Setup & Installation

### 1. Prerequisites
- Python 3.9+
- Node.js & npm
- Groq API Key

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd RAG_Chatbot/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `RAG_Chatbot/backend/`:
```env
GROQ_API_KEY=your_api_key_here
```

### 3. Ingest Data
Before running the chatbot, you must populate the vector database:
```bash
python ingest.py
```

### 4. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../frontend
npm install
```

## 🏃 Running the Application

1. **Start the Backend**:
   ```bash
   cd RAG_Chatbot/backend
   python app.py
   ```
   The API will run on `http://localhost:5000`.

2. **Start the Frontend**:
   ```bash
   cd RAG_Chatbot/frontend
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## 🔒 Security Note
This project contains a `.gitignore` that strictly excludes `.env` files and environment sensitive data. Ensure you never commit your `GROQ_API_KEY` to public repositories.
