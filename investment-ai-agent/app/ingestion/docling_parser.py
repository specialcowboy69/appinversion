import os
import logging
from typing import Optional
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DoclingParser:
    """
    Parser for financial documents using the Docling library.
    Extracts text and structure from PDFs and other supported formats.
    Optimized for low-memory environments.
    """
    
    def __init__(self):
        try:
            # Memory optimization: Disable OCR for text-based PDFs
            pipeline_options = PdfPipelineOptions()
            pipeline_options.do_ocr = False 
            pipeline_options.do_table_structure = True
            
            self.converter = DocumentConverter(
                format_options={
                    InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
                }
            )
            logger.info("Docling DocumentConverter initialized with memory-optimized settings (OCR disabled).")
        except Exception as e:
            logger.error(f"Failed to initialize Docling: {e}")
            raise

    def parse_file(self, file_path: str, page_range: Optional[list] = None) -> Optional[str]:
        """
        Parses a single file and returns its content in Markdown format.
        Args:
            file_path: Path to the document.
            page_range: Optional list [start, end] for specific pages (1-indexed).
        """
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return None
        
        logger.info(f"Starting to parse file: {file_path} (Range: {page_range})")
        try:
            result = self.converter.convert(file_path, page_range=page_range)
            # Export to markdown as it's best for RAG
            markdown_content = result.document.export_to_markdown()
            logger.info(f"Successfully parsed {file_path}")
            return markdown_content
        except Exception as e:
            logger.error(f"Error parsing {file_path}: {e}")
            return None

if __name__ == "__main__":
    # Test script
    import sys
    if len(sys.argv) > 1:
        parser = DoclingParser()
        content = parser.parse_file(sys.argv[1])
        if content:
            print("--- PARSED CONTENT START ---")
            print(content[:1000] + "...") # Print first 1000 chars
            print("--- PARSED CONTENT END ---")
        else:
            print("Failed to parse document.")
    else:
        print("Usage: python docling_parser.py <path_to_pdf>")
