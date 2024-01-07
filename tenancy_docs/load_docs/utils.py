import logging
import os
import sqlite3
from typing import Dict, List, Optional, Tuple


def remove_old_docs(url_array: List[str], source: str) -> None:
    """
    Remove old documents from the database that are not in the given URL array, for the given source.

    Args:
        url_array (List[str]): A list of URLs representing the documents to keep.
        source (str): The source of the documents.

    Returns:
        None
    """
    db_file = "../document_metadata.db"
    if not os.path.exists(db_file):
        logging.info(
            "No document metadata database found, skipping removal of old docs"
        )
        return

    conn = sqlite3.connect(db_file)
    c = conn.cursor()

    c.execute("SELECT doc_url FROM document_metadata WHERE source=?", (source,))
    metadata_entries = c.fetchall()

    conn.close()

    for metadata_entry in metadata_entries:
        url = metadata_entry[0]
        if url not in url_array:
            delete_document_metadata(None, url, None)


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
    db_file = "../document_metadata.db"
    if not os.path.exists(db_file):
        logging.error("No document metadata database found")
        return

    conn = sqlite3.connect(db_file)
    c = conn.cursor()

    if id:
        c.execute("DELETE FROM document_metadata WHERE id=?", (id,))
    elif doc_url:
        c.execute("DELETE FROM document_metadata WHERE doc_url=?", (doc_url,))
    elif title:
        c.execute("DELETE FROM document_metadata WHERE title=?", (title,))

    conn.commit()
    conn.close()


def add_document_metadata(
    title: str, doc_type: str, doc_url: str, source: str, fetched_at: str, doc_hash: str
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
    db_file = "../document_metadata.db"
    if not os.path.exists(db_file):
        logging.error("No document metadata database found")
        return

    conn = sqlite3.connect(db_file)
    c = conn.cursor()

    c.execute(
        "INSERT INTO document_metadata (title, doc_type, doc_url, source, fetched_at, doc_sha256_hash) VALUES (?, ?, ?, ?, ?, ?)",
        (title, doc_type, doc_url, source, fetched_at, doc_hash),
    )

    conn.commit()
    conn.close()


def get_all_document_metadata(file_path: str = "../document_metadata.db") -> List[Dict]:
    """
    Retrieves all document metadata from the database.

    Returns:
        List[Tuple]: A list of tuples containing the document metadata.
    """
    if not os.path.exists(file_path):
        print("error")
        logging.error("No document metadata database found")
        return

    conn = sqlite3.connect(file_path)
    conn.row_factory = (
        sqlite3.Row
    )  # This enables column access by name: row['column_name']
    c = conn.cursor()

    c.execute("SELECT * FROM document_metadata")
    document_metadata = c.fetchall()

    conn.close()

    return document_metadata


def get_all_document_metadata_from_source(
    source: str, file_path: str = "../document_metadata.db"
) -> List[Dict]:
    """
    Retrieves all document metadata from the database for the given source.

    Args:
        source (str): The source of the documents.
        file_path (str): The path to the database file.

    Returns:
        List[Tuple]: A list of tuples containing the document metadata.
    """
    if not os.path.exists(file_path):
        print("error")
        logging.error("No document metadata database found")
        return

    conn = sqlite3.connect(file_path)
    conn.row_factory = (
        sqlite3.Row
    )  # This enables column access by name: row['column_name']
    c = conn.cursor()

    c.execute("SELECT * FROM document_metadata WHERE source=?", (source,))
    document_metadata = c.fetchall()

    conn.close()

    return document_metadata


def get_document_metadata_from_url(doc_url: str) -> Optional[Tuple]:
    """
    Retrieves the document metadata from the given URL.

    Args:
        doc_url (str): The URL of the document.

    Returns:
        Optional[Tuple]: A tuple containing the document metadata if found, otherwise None.
    """
    db_file = "../document_metadata.db"
    if not os.path.exists(db_file):
        logging.error("No document metadata database found")
        return

    conn = sqlite3.connect(db_file)
    c = conn.cursor()

    c.execute("SELECT * FROM document_metadata WHERE doc_url=?", (doc_url,))
    document_metadata = c.fetchone()

    conn.close()

    return document_metadata


def update_doc_url(doc_url: str, new_doc_url: str) -> None:
    """
    Updates the doc_url for the given document.

    Args:
        doc_url (str): The URL of the document.
        new_doc_url (str): The new URL of the document.

    Returns:
        None
    """
    db_file = "../document_metadata.db"
    if not os.path.exists(db_file):
        logging.error("No document metadata database found")
        return

    conn = sqlite3.connect(db_file)
    c = conn.cursor()

    c.execute(
        "UPDATE document_metadata SET doc_url=? WHERE doc_url=?", (new_doc_url, doc_url)
    )

    conn.commit()
    conn.close()
