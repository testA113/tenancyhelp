from datetime import datetime
import logging
from typing import Dict, List
from dict_hash import sha256

from tenancy_docs.load_docs.utils import (
    add_document_metadata,
    delete_document_metadata,
    get_document_metadata_from_url,
    remove_old_docs,
)


def clear_old_case_metadata(cases: List[Dict[str, str]]) -> None:
    """
    Clears old documents by reading the new URLs from a CSV file and removing any documents that are not in the CSV file.
    """
    ids = [case["id"] for case in cases]
    # the url is the first section of the id that is separated by a underscore
    # e.g. https://forms.justice.govt.nz/search/Documents/TTV2/PDF/9685372-Tenancy_Tribunal_Order.pdf
    urls = []
    for id in ids:
        url = get_case_url_from_id(id)
        urls.append(url)
    remove_old_docs(url_array=urls, source="tribunal_cases")


def save_cases_metadata(cases: List[Dict[str, str]]) -> None:
    """
    Sets the metadata for the documents in the database.
    """
    fetched_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    doc_type = "pdf"
    source = "tribunal_cases"
    for case in cases:
        add_unique_case_metadata(
            case=case,
            doc_type=doc_type,
            source=source,
            fetched_at=fetched_at,
        )


def add_unique_case_metadata(
    case: Dict[str, str],
    doc_type: str,
    source: str,
    fetched_at: str,
) -> None:
    """
    Adds unique document metadata to the system. If the document already exists in the database, it will be updated if the hash has changed.

    Args:
        case (Dict[str, str]): The case.
        doc_type (str): The type of the document.
        source (str): The source of the document.
        fetched_at (str): The timestamp when the document was fetched.
    """
    title = case["tenancyAddress_s"][0] + " " + case["publishedDate_s"][0]
    doc_url = get_case_url_from_id(case["id"])

    # make a hash of the case
    new_hash = sha256(case)
    logging.info(f"Hash for {title}, {doc_url}: {new_hash}")

    metadata = get_document_metadata_from_url(doc_url)
    if not metadata:
        logging.info(f"Adding new document {title}, {doc_url}")
        add_document_metadata(title, doc_type, doc_url, source, fetched_at, new_hash)
        return

    existing_hash = metadata[5]
    if new_hash == existing_hash:
        logging.info(f"Document {title}, {doc_url} has not changed")
        return

    logging.info(f"Document {title}, {doc_url} has changed, updating")
    delete_document_metadata(None, doc_url, None)
    add_document_metadata(title, doc_type, doc_url, source, fetched_at, new_hash)
    return


def get_case_url_from_id(id: str) -> str:
    """
    Gets the URL of a case from the case ID.
    """
    return (
        "https://forms.justice.govt.nz/search/Documents/TTV2/PDF/"
        + id.split("_")[0]
        + "-Tenancy_Tribunal_Order.pdf"
    )
