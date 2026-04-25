# Document Ingestion Folder

Place any financial PDF documents here (e.g., Annual Reports, Earnings Presentations).
The agent will automatically:
1. Detect the file.
2. Parse it using Docling.
3. Index the content in the vector store.

**Recommended Naming Convention:**
`TICKER_DocumentType_Date.pdf`
Example: `MSFT_AnnualReport_2024.pdf`
