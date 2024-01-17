from tenancy_docs.load_docs.utils import (
    add_document_metadata,
    get_fetched_at,
    hash_file,
    remove_old_docs,
)

import constants


# Hardcoded for now, the versions can update every few months
def save_rta_metadata() -> None:
    remove_old_docs(url_array=[], source=constants.source)
    add_document_metadata(
        title="Residential Tenancies Act 1986",
        doc_type="pdf",
        doc_url=constants.doc_url,
        source=constants.source,
        fetched_at=get_fetched_at(),
        doc_hash=hash_file(constants.doc_url),
    )
