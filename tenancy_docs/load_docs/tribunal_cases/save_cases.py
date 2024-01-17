import logging
from typing import Dict
import requests

from tenancy_docs.load_docs.utils import (
    delete_document_metadata,
    get_all_document_metadata_from_source,
    update_doc_url,
)


def save_cases_locally() -> None:
    """
    Saves the unique pdfs to local storage.
    """
    # get the cases from the database
    docs = get_all_document_metadata_from_source("tribunal_cases")
    if docs is None:
        logging.error("No tribunal_cases documents found")
        return

    # save the cases to the docs directory
    for doc in docs:
        save_file(doc=doc)


def save_file(doc: Dict) -> None:
    """
    Saves the file from the given URL to the given file name.

    Args:
        doc (Dict): The document metadata.

    Returns:
        None
    """
    doc_url = doc["doc_url"]
    response = requests.get(doc_url, stream=True)

    # log an error and continue if the request was not successful
    new_doc_url = None
    if response.status_code != 200:
        # try to update the doc_url to end in -Tribunal_Order.pdf instead of -Tenancy_Tribunal_Order.pdf
        if doc_url.endswith("-Tenancy_Tribunal_Order.pdf"):
            new_doc_url = doc_url.replace(
                "-Tenancy_Tribunal_Order.pdf", "-Tribunal_Order.pdf"
            )
            logging.debug(f"Couldn't find pdf file. Trying {new_doc_url}")
            response = requests.get(new_doc_url, stream=True)
            if response.status_code == 200:
                logging.debug(f"Found {new_doc_url}")
                update_doc_url(doc_url, new_doc_url)
        else:
            logging.error(
                f"Error downloading {new_doc_url}, got status status {response.reason}"
            )
            logging.debug(f"Removing {doc['title']} from database")
            delete_document_metadata(None, doc_url, None)
            return

    # check if the file is corrupted
    if response.headers["Content-Type"] != "application/pdf":
        logging.error(f"Error downloading {doc['title']}, the response was not a pdf")
        logging.debug(f"Removing {doc['title']} from database")
        delete_document_metadata(None, doc_url, None)
        return

    # save the file in the pdfs directory
    # file_name = doc_url.split("/")[-1]
    if new_doc_url:
        file_name = new_doc_url.split("/")[-1]
    else:
        file_name = doc_url.split("/")[-1]
    with open(f"../docs/{file_name}", "wb") as f:
        f.write(response.content)
