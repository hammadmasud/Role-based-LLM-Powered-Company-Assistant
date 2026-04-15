import os
from pathlib import Path
from dotenv import load_dotenv

from langchain_community.document_loaders import DirectoryLoader, TextLoader, CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Load environment variables
load_dotenv()

# Define paths
BASE_DIR = Path(__file__).parent.parent.parent / "Data"
CHROMADB_DIR = Path(__file__).parent / "chroma_db"

def load_documents():
    """Load all markdown and CSV documents from the Data directory and its subdirectories."""
    documents = []

    if not BASE_DIR.exists():
        print(f"Error: Directory {BASE_DIR} not found.")
        return documents

    # Iterate over folders representing 'Roles' within the Data Directory
    for role_folder in BASE_DIR.iterdir():
        if not role_folder.is_dir():
            continue
            
        role_name = role_folder.name
        print(f"Loading documents for role: {role_name} from {role_folder}...")

        # Load Markdown files
        md_loader = DirectoryLoader(
            str(role_folder),
            glob="**/*.md",
            loader_cls=TextLoader,
            show_progress=True
        )
        md_docs = md_loader.load()
        for doc in md_docs:
            doc.metadata["role"] = role_name # Critical: Inject Role metadata for RBAC
        documents.extend(md_docs)

        # Load CSV files (specifically for HR)
        csv_loader = DirectoryLoader(
            str(role_folder),
            glob="**/*.csv",
            loader_cls=CSVLoader,
            show_progress=True
        )
        csv_docs = csv_loader.load()
        for doc in csv_docs:
            doc.metadata["role"] = role_name # Critical: Inject Role metadata for RBAC
        documents.extend(csv_docs)

    print(f"Total documents loaded: {len(documents)}")
    return documents

def split_documents(documents):
    """Split documents into smaller chunks for embeddings."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks from {len(documents)} documents.")
    return chunks

def store_in_chroma(chunks):
    """Store chunks in a Chroma Vector Database."""
    print(f"Saving to ChromaDB at: {CHROMADB_DIR}...")
    
    # 1. Clear existing database for a clean re-ingest (fixes 'stale data' hallucinations)
    import shutil
    if CHROMADB_DIR.exists():
        print("Clearing existing ChromaDB...")
        shutil.rmtree(CHROMADB_DIR)

    # Using local open-source embeddings since Groq doesn't provide embedding models
    embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # Create & Save
    db = Chroma.from_documents(
        chunks, 
        embeddings_model, 
        persist_directory=str(CHROMADB_DIR)
    )
    print("Successfully ingested documents into ChromaDB! The KB is ready.")

if __name__ == "__main__":
    docs = load_documents()
    if docs:
        chunks = split_documents(docs)
        store_in_chroma(chunks)
    else:
        print("No documents found to process.")
