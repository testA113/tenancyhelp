import requests
from tenancy_docs.load_docs.utils import (
    get_all_document_metadata_from_source,
)

from utils import get_cookies


def save_docs_locally() -> None:
    """
    Saves the unique pdfs to local storage.
    """
    # get the pdfs from the database
    docs = get_all_document_metadata_from_source("tenancy_services_pdfs")

    # save the pdfs to the docs directory
    for doc in docs:
        doc_url = doc["doc_url"]
        save_file(doc_url=doc_url)


def save_file(doc_url: str) -> None:
    """
    Saves the file from the given URL to the given file name.

    Args:
        doc_url (str): The URL of the file to be downloaded.
        file_name (str): The name of the file to be saved.

    Returns:
        None
    """
    [cookie_name, cookie_value] = get_cookies()
    response = requests.get(doc_url, stream=True, cookies={cookie_name: cookie_value})
    # save the file in the pdfs directory
    file_name = doc_url.split("/")[-1]
    with open(f"../docs/{file_name}", "wb") as f:
        f.write(response.content)
