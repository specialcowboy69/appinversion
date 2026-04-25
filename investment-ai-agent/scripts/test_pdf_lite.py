import os
import sys
import logging
from dotenv import load_dotenv

# Add the project root to sys.path
sys.path.append(os.getcwd())

from app.ingestion.simple_parser import SimpleParser
from app.rag.vector_store import VectorStoreManager
from app.main import InvestmentAgent

def run_test():
    load_dotenv()
    
    pdf_path = "data/documents/THE-INTELLIGENT-INVESTOR.pdf"
    
    print(f"--- 1. Iniciando parseo LIGERO (Sin IA pesada, Páginas 1-50) ---")
    parser = SimpleParser()
    content = parser.parse_file(pdf_path, page_range=[1, 50])
    
    if not content:
        print("Error: No se pudo extraer contenido.")
        return

    print(f"--- 2. Indexando contenido en ChromaDB ---")
    vsm = VectorStoreManager()
    vsm.add_markdown_content(content, {"source": pdf_path})
    
    print("--- 3. Realizando consultas al Agente ---")
    agent = InvestmentAgent()
    queries = ["¿Qué es el Margen de Seguridad?", "¿Quién es el Señor Mercado?"]
    
    for query in queries:
        print(f"\nPREGUNTA: {query}")
        response = agent.chat(query)
        print(f"RESPUESTA:\n{response}")

if __name__ == "__main__":
    run_test()
