import logging
import requests
import logging
import requests
from typing import List, Dict

from tenancy_docs.load_docs.tribunal_cases.save_doc_metadata import (
    clear_old_doc_metadata,
    save_cases_metadata,
)


def load_tribunal_cases() -> List[Dict[str, str]]:
    base_url = "https://forms.justice.govt.nz/solr/TTV2/select"
    headers = {"Accept": "application/json"}
    queries = get_queries()
    cases = []
    for query in queries:
        res = requests.get(base_url, headers=headers, params=query)
        res_dict = res.json()
        cases += res_dict["response"]["docs"]

    unique_cases = get_unique_cases(cases)
    logging.info(f"Found {len(unique_cases)} cases")
    return unique_cases


def get_unique_cases(docs: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """
    Get the unique documents from the given list of documents.

    Args:
        docs (List[Dict[str, str]]): A list of documents.

    Returns:
        List[Dict[str, str]]: A list of unique documents.
    """
    unique_docs: List[Dict[str, str]] = []
    for doc in docs:
        doc_id = doc["id"]
        if not any(unique_doc["id"] == doc_id for unique_doc in unique_docs):
            unique_docs.append(doc)
    return unique_docs


def get_queries() -> List[Dict[str, str]]:
    return [
        {
            "rows": "10",
            "sort": "decisionDateIndex_l desc",
            "q": 'costAwarded_s:"Applicant"',
            "wt": "json",
        },
        {
            "rows": "10",
            "sort": "decisionDateIndex_l desc",
            "q": 'costAwarded_s:"Respondent"',
            "wt": "json",
        },
        {
            "rows": "10",
            "sort": "decisionDateIndex_l desc",
            "q": 'costAwarded_s:"Landlord"',
            "wt": "json",
        },
        {
            "rows": "10",
            "sort": "decisionDateIndex_l desc",
            "q": 'costAwarded_s:"Tenant"',
            "wt": "json",
        },
    ]


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    cases = load_tribunal_cases()
    clear_old_doc_metadata(cases)
    save_cases_metadata(cases)
