# AI Investment Agent

Expert AI agent for financial analysis, RAG-based document learning, and investment recommendations.

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   Copy `.env.example` to `.env` and add your `GOOGLE_API_KEY`.

3. **Run the Ingestion Watcher**:
   Keep this running to automatically process any PDF added to `data/documents`.
   ```bash
   python -m app.ingestion.folder_watcher
   ```

4. **Run the Agent**:
   ```bash
   python -m app.main
   ```

## Folder Structure

- `app/`: Source code.
  - `agent/`: Orchestration and prompts.
  - `ingestion/`: Docling parser and folder watcher.
  - `rag/`: Vector database and retrieval.
  - `scraping/`: Scrapy spiders (Phase 2+).
  - `finance/`: Financial analysis logic.
- `data/`: Data storage.
  - `documents/`: Put your financial PDFs here.
  - `vector_store/`: Persistent vector database.
- `tests/`: Automated tests.
