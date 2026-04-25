import os
import sys
import logging
from dotenv import load_dotenv

# Configure logging to be less verbose for the test
logging.basicConfig(level=logging.WARNING)

# Add the project root to sys.path
sys.path.append(os.getcwd())

from app.ingestion.docling_parser import DoclingParser
from app.rag.vector_store import VectorStoreManager
from app.main import InvestmentAgent

def run_test():
    load_dotenv()
    
    pdf_path = "data/documents/THE-INTELLIGENT-INVESTOR.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"ERROR: No se encuentra el archivo en {pdf_path}")
        return

    print(f"--- 1. Iniciando parseo de PDF (Páginas 1-30) ---")
    try:
        parser = DoclingParser()
        content = parser.parse_file(pdf_path, page_range=[1, 30])
    except Exception as e:
        print(f"ERROR al inicializar Docling: {e}")
        print("Asegúrate de tener instaladas las dependencias: pip install docling")
        return
    
    if not content:
        print("Error: No se pudo extraer contenido del PDF.")
        return

    print(f"--- 2. Indexando contenido en ChromaDB ---")
    vsm = VectorStoreManager()
    metadata = {"source": pdf_path, "title": "The Intelligent Investor"}
    vsm.add_markdown_content(content, metadata)
    
    print("--- 3. Inicializando Agente y realizando consultas ---")
    agent = InvestmentAgent()
    
    queries = [
        "¿Qué es el 'Margen de Seguridad' (Margin of Safety) según el libro?",
        "¿Quién es el 'Señor Mercado' (Mr. Market) y qué representa?"
    ]
    
    for query in queries:
        print(f"\n--- CONSULTA: {query} ---")
        response = agent.chat(query)
        print(f"RESPUESTA:\n{response}")

if __name__ == "__main__":
    run_test()
