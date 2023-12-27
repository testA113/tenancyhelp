import os
import shutil

import requests

from utils import get_all_document_metadata, get_cookies


def save_docs_locally() -> None:
    """
    Saves the unique pdfs to local storage.
    """
    # clear the pdf directory if it exists
    if os.path.exists("pdfs"):
        shutil.rmtree("pdfs")

    # create the pdf directory
    os.mkdir("pdfs")

    # get the pdfs from the database
    docs = get_all_document_metadata()

    # save the pdfs to the pdf directory
    for doc in docs:
        # get the url and file name
        file_name = doc["title"]
        doc_url = doc["doc_url"]

        # save the file
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
    with open(f"pdfs/{file_name}", "wb") as f:
        f.write(response.content)
