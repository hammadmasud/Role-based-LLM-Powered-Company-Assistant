import os
from rag_pipeline import answer_question, format_docs, CHROMADB_DIR
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

print("Testing Retriever context for Q2 Finance:")
embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = Chroma(persist_directory=str(CHROMADB_DIR), embedding_function=embeddings_model)

retriever = db.as_retriever(
    search_kwargs={
        "filter": {
            "role": {
                "$in": ["Finance", "General"]
            }
        },
        "k": 5
    }
)

query = "Revenue from April to June 2024"
docs = retriever.invoke(query)
print(f"Retrieved {len(docs)} documents for query: '{query}':")
for i, d in enumerate(docs):
    print(f"\n--- Doc {i+1} Metadata: {d.metadata} ---")
    print(d.page_content[:400] + "...")

