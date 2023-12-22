import logging
import csv

from utils import get_cookie, remove_old_docs, add_unique_document_metadata


import csv


def clear_old_docs() -> None:
    """
    Clears old documents by reading the new URLs from a CSV file and removing any documents that are not in the CSV file.
    """
    with open("links.csv", "r") as csv_file:
        reader = csv.DictReader(csv_file)
        new_docs_url_array = []
        for row in reader:
            new_docs_url_array.append(row["doc_url"])
        remove_old_docs(new_docs_url_array)


def set_metadata() -> None:
    """
    Sets the metadata for the documents in the database.
    """
    cookie_name, cookie_value = get_cookie()
    with open("links.csv", "r") as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            title = row["title"]
            doc_type = row["doc_type"]
            doc_url = row["doc_url"]
            fetched_at = row["fetched_at"]
            add_unique_document_metadata(
                title=title,
                doc_type=doc_type,
                doc_url=doc_url,
                fetched_at=fetched_at,
                cookie_name=cookie_name,
                cookie_value=cookie_value,
            )


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    clear_old_docs()
    set_metadata()
