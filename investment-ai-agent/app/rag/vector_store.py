import os
import logging
from typing import List, Optional
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class VectorStoreManager:
    """
    Manages the vector database for RAG operations using Google Gemini Embeddings.
    Supports indexing documents and retrieving relevant context.
    """
    
    def __init__(self, persist_directory: str = "data/vector_store"):
        self.persist_directory = persist_directory
        # Note: GOOGLE_API_KEY must be in .env
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        self.vector_db = None
        self._initialize_db()

    def _initialize_db(self):
        """Initializes or loads the Chroma database."""
        try:
            if not os.path.exists(self.persist_directory):
                os.makedirs(self.persist_directory)
            
            self.vector_db = Chroma(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings
            )
            logger.info(f"Vector store initialized at {self.persist_directory} using Google Embeddings.")
        except Exception as e:
            logger.error(f"Error initializing vector store: {e}")

    def add_markdown_content(self, content: str, metadata: dict):
        """
        Splits markdown content semantically and adds it to the vector store.
        """
        # First split by headers to keep structure
        headers_to_split_on = [
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
        ]
        markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
        md_header_splits = markdown_splitter.split_text(content)
        
        # Then split into smaller chunks for better retrieval
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        splits = text_splitter.split_documents(md_header_splits)
        
        # Add metadata to each split
        for split in splits:
            split.metadata.update(metadata)
            
        logger.info(f"Adding {len(splits)} chunks to vector store.")
        self.vector_db.add_documents(splits)
        self.vector_db.persist()
        logger.info("Vector store persisted.")

    def search(self, query: str, k: int = 5, filter: Optional[dict] = None) -> List:
        """
        Performs a semantic search in the vector store.
        """
        if not self.vector_db:
            logger.error("Vector DB not initialized.")
            return []
        
        results = self.vector_db.similarity_search(query, k=k, filter=filter)
        return results

if __name__ == "__main__":
    # Test script
    manager = VectorStoreManager()
    print("Vector Store Manager ready with Google Gemini.")
