import time
import os
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from app.ingestion.docling_parser import DoclingParser
from app.rag.vector_store import VectorStoreManager

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DocumentHandler(FileSystemEventHandler):
    """
    Handles file system events for new documents.
    """
    def __init__(self, parser: DoclingParser, vector_store: VectorStoreManager):
        self.parser = parser
        self.vector_store = vector_store
        # To avoid processing files while they are still being written
        self.last_processed = {}

    def on_created(self, event):
        if event.is_directory:
            return
        self._process_file(event.src_path)

    def on_modified(self, event):
        if event.is_directory:
            return
        self._process_file(event.src_path)

    def _process_file(self, file_path: str):
        # Support only PDFs for now as per MVP
        if not file_path.lower().endswith('.pdf'):
            return
        
        # Debounce/Wait for file to be ready
        file_name = os.path.basename(file_path)
        current_time = time.time()
        if file_path in self.last_processed and (current_time - self.last_processed[file_path] < 5):
            return
        
        logger.info(f"New document detected: {file_name}")
        time.sleep(1) # Small buffer
        
        content = self.parser.parse_file(file_path)
        if content:
            metadata = {
                "source": file_name,
                "file_path": file_path,
                "ingestion_date": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            # Attempt to extract ticker/company from filename if possible
            # e.g., MSFT_AnnualReport.pdf -> Ticker: MSFT
            parts = file_name.split('_')
            if len(parts) > 1:
                metadata["ticker"] = parts[0].upper()
            
            self.vector_store.add_markdown_content(content, metadata)
            self.last_processed[file_path] = time.time()
            logger.info(f"Successfully ingested and indexed: {file_name}")
        else:
            logger.error(f"Failed to process: {file_name}")

class FolderWatcher:
    """
    Watches a folder for new documents and processes them.
    """
    def __init__(self, watch_dir: str = "data/documents"):
        self.watch_dir = watch_dir
        self.parser = DoclingParser()
        self.vector_store = VectorStoreManager()
        self.event_handler = DocumentHandler(self.parser, self.vector_store)
        self.observer = Observer()

    def start(self):
        if not os.path.exists(self.watch_dir):
            os.makedirs(self.watch_dir)
        
        # Process existing files first
        logger.info(f"Scanning existing files in {self.watch_dir}...")
        for file_name in os.listdir(self.watch_dir):
            if file_name.lower().endswith('.pdf'):
                self.event_handler._process_file(os.path.join(self.watch_dir, file_name))

        self.observer.schedule(self.event_handler, self.watch_dir, recursive=False)
        self.observer.start()
        logger.info(f"Watching folder: {self.watch_dir}")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.observer.stop()
        self.observer.join()

if __name__ == "__main__":
    watcher = FolderWatcher()
    watcher.start()
