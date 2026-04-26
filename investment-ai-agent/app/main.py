import os
import logging
import yfinance as yf
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.tools import tool
from langchain_community.tools.ddg_search.tool import DuckDuckGoSearchRun
from app.rag.vector_store import VectorStoreManager
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Load env and configure logging
load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="Investment AI Agent API")

# Initialize Vector Store
vector_store = VectorStoreManager()

# --- Tools Definition ---

@tool
def get_stock_data(ticker: str):
    """
    Retrieves real-time financial data for a stock ticker (e.g. AAPL, TSLA).
    Returns price, dividend yield, and a brief summary.
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return {
            "price": info.get("currentPrice") or info.get("regularMarketPrice"),
            "currency": info.get("currency"),
            "dividendYield": info.get("dividendYield"),
            "sector": info.get("sector"),
            "longBusinessSummary": info.get("longBusinessSummary")[:500] + "..." if info.get("longBusinessSummary") else "No summary available"
        }
    except Exception as e:
        return f"Error fetching data for {ticker}: {e}"

@tool
def search_investment_strategy(query: str):
    """
    Searches internal documents and investment books (like Graham or Buffett) 
    to get investment criteria and wisdom.
    """
    results = vector_store.search(query, k=3)
    return "\n\n".join([doc.page_content for doc in results])

@tool
def search_market_news(query: str):
    """
    Searches the web for latest market news and sentiment about a company or sector.
    """
    try:
        search = DuckDuckGoSearchRun()
        return search.run(query)
    except Exception as e:
        return f"Error searching news: {e}"

# --- Agent Initialization ---

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
tools = [get_stock_data, search_investment_strategy, search_market_news]

prompt = ChatPromptTemplate.from_messages([
    ("system", """Eres un Analista de Inversiones Senior. Tu misión es dar veredictos de inversión razonados.
    Para cada consulta, DEBES seguir este proceso:
    1. Buscar datos reales de la empresa usando 'get_stock_data'.
    2. Buscar noticias y sentimiento actual usando 'search_market_news'.
    3. Consultar tu base de sabiduría interna usando 'search_investment_strategy' para aplicar criterios de inversión probados.
    4. Sintetizar todo en un veredicto final claro y en ESPAÑOL, citando tus fuentes y explicando por qué llegas a esa conclusión."""),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# --- API Models ---

class ChatRequest(BaseModel):
    input: str

class ChatResponse(BaseModel):
    response: str

# --- Endpoints ---

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        logger.info(f"Received query: {request.input}")
        result = agent_executor.invoke({"input": request.input})
        return ChatResponse(response=result["output"])
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
