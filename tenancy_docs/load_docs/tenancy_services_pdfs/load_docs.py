import logging

from get_links import get_links_from_html, get_web_page
from init_database import init_document_metadata_db
from save_docs import save_docs_locally
from set_doc_metadata import (
    clear_old_doc_metadata,
    set_doc_metadata,
)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    get_web_page()
    get_links_from_html()
    init_document_metadata_db()
    clear_old_doc_metadata()
    set_doc_metadata()
    save_docs_locally()
