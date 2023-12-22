import hashlib
import json
import logging
import sqlite3
from typing import List, Optional, Tuple

import requests


def remove_old_docs(url_array: List[str]) -> None:
    """
    Remove old documents from the document_metadata database that are not present in the given url_array.

    Args:
        url_array (List[str]): A list of URLs representing the documents to keep.

    Returns:
        None
    """
    conn = sqlite3.connect("document_metadata.db")
    c = conn.cursor()

    c.execute("SELECT doc_url FROM document_metadata")
    metadata_entries = c.fetchall()

    conn.close()

    for metadata_entry in metadata_entries:
        url = metadata_entry[0]
        if url not in url_array:
            delete_document_metadata(None, url, None)


import sqlite3
from typing import Optional


def delete_document_metadata(
    id: Optional[int], doc_url: Optional[str], title: Optional[str]
) -> None:
    """
    Delete document metadata from the database based on the provided parameters.

    Args:
        id (Optional[int]): The ID of the document metadata to delete.
        doc_url (Optional[str]): The URL of the document metadata to delete.
        title (Optional[str]): The title of the document metadata to delete.

    Returns:
        None
    """
    conn = sqlite3.connect("document_metadata.db")
    c = conn.cursor()

    if id:
        c.execute("DELETE FROM document_metadata WHERE id=?", (id,))
    elif doc_url:
        c.execute("DELETE FROM document_metadata WHERE doc_url=?", (doc_url,))
    elif title:
        c.execute("DELETE FROM document_metadata WHERE title=?", (title,))

    conn.commit()
    conn.close()


import sqlite3


def add_document_metadata(
    title: str, doc_type: str, doc_url: str, fetched_at: str, doc_hash: str
) -> None:
    """
    Add document metadata to the database.

    Args:
        title (str): The title of the document.
        doc_type (str): The type of the document.
        doc_url (str): The URL of the document.
        fetched_at (str): The timestamp when the document was fetched.
        doc_hash (str): The SHA256 hash of the document.

    Returns:
        None
    """
    conn = sqlite3.connect("document_metadata.db")
    c = conn.cursor()

    c.execute(
        "INSERT INTO document_metadata (title, doc_type, doc_url, fetched_at, doc_sha256_hash) VALUES (?, ?, ?, ?, ?)",
        (title, doc_type, doc_url, fetched_at, doc_hash),
    )

    conn.commit()
    conn.close()


def add_unique_document_metadata(
    title: str,
    doc_type: str,
    doc_url: str,
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
        add_document_metadata(title, doc_type, doc_url, fetched_at, new_hash)
        return

    existing_hash = metadata[5]
    if new_hash == existing_hash:
        return

    delete_document_metadata(None, doc_url, None)
    add_document_metadata(title, doc_type, doc_url, fetched_at, new_hash)
    return


def get_document_metadata_from_url(doc_url: str) -> Optional[Tuple]:
    """
    Retrieves the document metadata from the given URL.

    Args:
        doc_url (str): The URL of the document.

    Returns:
        Optional[Tuple]: A tuple containing the document metadata if found, otherwise None.
    """
    conn = sqlite3.connect("document_metadata.db")
    c = conn.cursor()

    c.execute("SELECT * FROM document_metadata WHERE doc_url=?", (doc_url,))
    documentMetadata = c.fetchone()

    conn.close()

    return documentMetadata


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


def get_cookie() -> Tuple[str, str]:
    """
    Retrieves the cookie name and value from the 'cookies.json' file.

    Returns:
        A tuple containing the cookie name and value.
    """
    with open("cookies.json", "r") as f:
        cookie_dict = json.load(f)
        cookie_name, cookie_value = list(cookie_dict.items())[0]
    return cookie_name, cookie_value
