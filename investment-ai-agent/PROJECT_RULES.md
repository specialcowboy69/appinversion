# PROJECT_RULES.md - AI Investment Agent

## Safety Rules
1. **No Execution of Orders**: The agent MUST NOT execute real financial transactions (buy/sell).
2. **Confirmation Required**: Any persistent changes to the system (like adding new scrapers) require human approval.
3. **Data Integrity**: Never delete user documents without explicit confirmation.
4. **Permissions**: The agent operates only within the `investment-ai-agent/` directory.

## Operational Guidelines
1. **Source Attribution**: Every financial recommendation or data point must be attributed to a source.
2. **Fact vs Opinion**: Clearly distinguish between facts (historical data), inferences (interpretations), and predictions (projections).
3. **Prudence**: Always include a financial disclaimer. Avoid absolute claims about future performance.
4. **Versioning**: Log the ingestion date and version of any financial document.

## Technical Constraints
1. **Tech Stack**: Use Python for the backend, Docling for PDF parsing, and Scrapy for web data.
2. **Modularity**: Components (Parser, RAG, Scraper) should be decoupled.
3. **Security**: Do not store API keys in plain text. Use `.env` files.
