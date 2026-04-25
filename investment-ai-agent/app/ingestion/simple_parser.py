import os
import logging
from typing import Optional
import pypdfium2 as pdfium

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SimpleParser:
    """
    A lightweight PDF parser that extracts text without heavy AI models.
    Ideal for memory-constrained environments.
    """
    
    def parse_file(self, file_path: str, page_range: Optional[list] = None) -> Optional[str]:
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return None
        
        logger.info(f"Starting Simple Parsing: {file_path} (Range: {page_range})")
        try:
            pdf = pdfium.PdfDocument(file_path)
            text_content = []
            
            # Determine pages to process
            total_pages = len(pdf)
            start_page = page_range[0] - 1 if page_range else 0
            end_page = min(page_range[1], total_pages) if page_range else total_pages
            
            for i in range(start_page, end_page):
                page = pdf[i]
                text_page = page.get_textpage()
                text_content.append(text_page.get_text_bounded())
                
            logger.info(f"Successfully extracted text from {end_page - start_page} pages.")
            return "\n\n".join(text_content)
        except Exception as e:
            logger.error(f"Error in SimpleParser: {e}")
            return None
