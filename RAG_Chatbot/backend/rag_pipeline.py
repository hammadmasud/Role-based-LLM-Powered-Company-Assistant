import os
from pathlib import Path

from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

CHROMADB_DIR = Path(__file__).parent / "chroma_db"

import re

def format_docs(docs):
    """Formats retrieved document chunks into a single readable string."""
    return "\n\n".join(doc.page_content for doc in docs)

def answer_question(question: str, role: str) -> str:
    """Answers the question using RAG by fetching only documents relevant to the given role or general."""
    
    # 1. Initialize Embeddings & Reference to Chroma Store
    embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = Chroma(persist_directory=str(CHROMADB_DIR), embedding_function=embeddings_model)

    # 2. Construct Retrievers with strict RBAC filtering logic
    # Role users should have access to their specific role files OR general files.
    if role == "Admin":
         retriever = db.as_retriever(search_kwargs={"k": 5})
    else:
         # Query filter mapping enforcing strict Role Access via ChromaDB '$in' filter
         retriever = db.as_retriever(
             search_kwargs={
                 "filter": {
                     "role": {
                         "$in": [role, "General"]
                     }
                 },
                 "k": 5
             }
         )

    # 3. Setup LLM, Prompt, and Parser
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0)
    
    system_prompt = (
        "You are FinTechX, an elite AI organizational intelligence assistant. "
        "Your goal is to provide highly structured, premium-quality technical information based on the context.\n\n"
        "FORMATTING RULES:\n"
        "1.Information should be from the Provided Context Only\n"
        "2. PROPER FLOW: Always structure responses\n"
        "3. MARKDOWN: Use bolding, bullet points, and headers liberally to ensure readability. Your response will be rendered as Markdown.\n"
        "4. TONE: Sharp, professional, and efficient. No conversational filler.\n"
        "5. SCOPE: If the answer is not visible in the context for role '{role}', state it as a restriction.\n\n"
        
        "Context:\n{context}\n\n"
        "Question: {question}"
    )
    prompt = ChatPromptTemplate.from_template(system_prompt)
    parser = StrOutputParser()

    # 4. Construct LCEL Pipeline
    parallel_chain = RunnableParallel({
        "context": retriever | RunnableLambda(format_docs),
        "question": RunnablePassthrough(),
        "role": lambda x: role
    })

    main_chain = parallel_chain | prompt | llm | parser

    # Invoke pipeline
    response_text = main_chain.invoke(question)
    return response_text
