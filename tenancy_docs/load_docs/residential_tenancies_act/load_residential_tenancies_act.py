import logging

import requests

import constants
from tenancy_docs.load_docs.residential_tenancies_act.save_metadata import (
    save_rta_metadata,
)

def save_residential_tenancies_act() -> None:
    """
    Loads the Residential Tenancies Act into the database and saves it locally.
    """
    response = requests.get(
        constants.doc_url,
        stream=True,
        headers={"User-Agent": "Chrome/120.0.0.0"},
        timeout=20,
    )
    # save the file in the pdfs directory
    file_name = constants.doc_url.split("/")[-1]
    with open(f"../docs/{file_name}", "wb") as f:
        f.write(response.content)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    save_residential_tenancies_act()
    save_rta_metadata()
