import os
import logging
from typing import List
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.memory import ConversationBufferMemory
from app.rag.vector_store import VectorStoreManager

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class InvestmentAgent:
    """
    Main agent that orchestrates RAG, analysis, and reporting using Google Gemini.
    """
    
    def __init__(self):
        self.vector_store_manager = VectorStoreManager()
        # Initialize Google Gemini Pro
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        self.qa_chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.vector_store_manager.vector_db.as_retriever(search_kwargs={"k": 5}),
            memory=self.memory
        )
        logger.info("Investment Agent initialized with Google Gemini.")

    def chat(self, query: str) -> str:
        """
        Processes a user query and returns a response based on internal documents.
        """
        logger.info(f"Processing query: {query}")
        try:
            response = self.qa_chain.invoke({"question": query})
            return response["answer"]
        except Exception as e:
            logger.error(f"Error in chat: {e}")
            return f"Lo siento, ocurrió un error al procesar tu solicitud: {e}"

    def generate_report(self, ticker: str):
        """
        Generates a full investment report for a ticker.
        """
        prompt = f"Genera un informe de inversión detallado para {ticker} basado en los documentos disponibles."
        return self.chat(prompt)

if __name__ == "__main__":
    agent = InvestmentAgent()
    print("Agente de Inversión listo (Gemini). Escribe 'salir' para terminar.")
    while True:
        user_input = input("Tú: ")
        if user_input.lower() in ["salir", "exit", "quit"]:
            break
        respuesta = agent.chat(user_input)
        print(f"Agente: {respuesta}")
