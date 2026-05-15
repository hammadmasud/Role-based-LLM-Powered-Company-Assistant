# FinTechX: Role-Based LLM-Powered Company Assistant

## 📖 About the Project
**FinTechX** is an advanced AI-driven organizational assistant built to bridge the gap between internal knowledge and secure accessibility. In modern enterprises, data is often siloed and sensitive; FinTechX solves this by using a high-performance **Retrieval-Augmented Generation (RAG)** architecture coupled with a robust **Role-Based Access Control (RBAC)** system. 

Whether it's an engineer searching for technical documentation, an HR lead reviewing policies, or an executive looking for financial summaries, FinTechX ensures that the right information reaches the right person—instantly and securely. By leveraging the speed of **Groq** and the intelligence of **Llama 3.1**, it delivers precise, context-aware answers without compromising departmental data privacy.

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

<!-- gitpulse:contribution index="1" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="2" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="3" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="4" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="5" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="6" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="7" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="8" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="9" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="10" timestamp="2026-05-10" -->
<!-- gitpulse:contribution index="11" timestamp="2026-05-16" -->
<!-- gitpulse:contribution index="12" timestamp="2026-05-16" -->
<!-- gitpulse:contribution index="13" timestamp="2026-05-16" -->
<!-- gitpulse:contribution index="14" timestamp="2026-05-16" -->
<!-- gitpulse:contribution index="15" timestamp="2026-05-16" -->