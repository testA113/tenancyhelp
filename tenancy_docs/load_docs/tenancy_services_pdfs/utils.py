import hashlib
import json
import logging
import os
import sqlite3
from typing import Tuple

import requests

from tenancy_docs.load_docs.utils import (
    add_document_metadata,
    delete_document_metadata,
    get_document_metadata_from_url,
)

db_file = "../document_metadata.db"


def add_unique_document_metadata(
    title: str,
    doc_type: str,
    doc_url: str,
    source: str,
    fetched_at: str,
    cookie_name: str,
    cookie_value: str,
) -> None:
    """
    Adds unique document metadata to the system. If the document already exists in the database, it will be updated if the hash has changed.

    Args:
        title (str): The title of the document.
        doc_type (str): The type of the document.
        doc_url (str): The URL of the document.
        fetched_at (str): The timestamp when the document was fetched.
        cookie_name (str): The name of the cookie used for authentication.
        cookie_value (str): The value of the cookie used for authentication.
    """
    new_hash = hash_file(
        doc_url=doc_url, cookie_name=cookie_name, cookie_value=cookie_value
    )

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


def hash_file(doc_url: str, cookie_name: str, cookie_value: str) -> str:
    """
    Calculates the SHA1 hash of a file downloaded from the given URL using the provided cookies.

    Args:
        doc_url (str): The URL of the file to be downloaded and hashed.
        cookie_name (str): The name of the cookie to be used for authentication.
        cookie_value (str): The value of the cookie to be used for authentication.

    Returns:
        str: The SHA1 hash of the downloaded file.
    """
    logging.debug(
        f"Making a request to {doc_url} with cookies {cookie_name}={cookie_value}"
    )
    response = requests.get(doc_url, stream=True, cookies={cookie_name: cookie_value})

    sha1 = hashlib.sha1()

    for chunk in response.iter_content(chunk_size=8192):
        sha1.update(chunk)

    logging.debug(f"Hash of {doc_url} is {sha1.hexdigest()}")
    return sha1.hexdigest()


def save_cookies(cookie_name: str, cookie_value: str) -> None:
    """
    Save the provided cookie name and value to a JSON file.

    Args:
        cookie_name (str): The name of the cookie.
        cookie_value (str): The value of the cookie.

    Returns:
        None
    """
    with open("cookies.json", "w") as f:
        json.dump({cookie_name: cookie_value}, f)


def get_cookies() -> Tuple[str, str]:
    """
    Retrieves the cookie name and value from the 'cookies.json' file.

    Returns:
        A tuple containing the cookie name and value.
    """
    with open("cookies.json", "r") as f:
        cookie_dict = json.load(f)
        cookie_name, cookie_value = list(cookie_dict.items())[0]
    return cookie_name, cookie_value
