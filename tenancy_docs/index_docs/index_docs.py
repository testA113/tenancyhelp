import logging
import os
import dotenv
from llama_index import (
    Document,
    OpenAIEmbedding,
    VectorStoreIndex,
    SimpleDirectoryReader,
    ServiceContext,
    download_loader,
)
from llama_index.vector_stores import ChromaVectorStore
from llama_index.storage.storage_context import StorageContext
import chromadb
from typing import List
from tenancy_docs.index_docs.utils import get_embed_model


from tenancy_docs.load_docs.tenancy_services_pdfs.utils import get_all_document_metadata


def index_docs():
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
    OpenAIEmbedding.api_key = os.environ["OPENAI_API_KEY"]
    embed_model = get_embed_model()

    # set up ChromaVectorStore and load in data
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    chroma_collection = chroma_client.get_or_create_collection("tenancy_docs")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    service_context = ServiceContext.from_defaults(embed_model=embed_model)
    index = VectorStoreIndex.from_vector_store(
        vector_store,
        service_context=service_context,
    )

    loaded_docs = get_all_document_metadata(
        file_path="../load_docs/tenancy_services_pdfs/document_metadata.db"
    )

    # If there are docs in the collection that aren't in the database, delete them from the collection
    loaded_doc_hashes = [doc["doc_sha256_hash"] for doc in loaded_docs]
    indexed_docs = chroma_collection.get(
        where={"doc_sha256_hash": {"$ne": ""}},
    )
    indexed_doc_hashes = [doc["doc_sha256_hash"] for doc in indexed_docs["metadatas"]]
    doc_indexes_to_delete: chromadb.IDs = []
    for i, indexed_doc_hash in enumerate(indexed_doc_hashes):
        if indexed_doc_hash not in loaded_doc_hashes:
            doc_indexes_to_delete.append(i)
    doc_ids_to_delete = [indexed_docs["ids"][i] for i in doc_indexes_to_delete]
    if len(doc_ids_to_delete) > 0:
        logging.info(f"Deleting {len(doc_ids_to_delete)} documents from the index")
        chroma_collection.delete(doc_ids_to_delete)
    else:
        logging.info("No documents to delete from the index")

    # update the index with the new documents
    documents: List[Document] = []
    skipped_docs = 0
    for doc in loaded_docs:
        try:
            # if the document is already in the index with the same hash, then skip it
            indexed_doc_found = chroma_collection.get(
                where={"doc_sha256_hash": doc["doc_sha256_hash"]},
            )
            if len(indexed_doc_found["ids"]) > 0:
                skipped_docs += 1
                continue

            # otherwise, add the document to the index
            doc_file_name = doc["doc_url"].split("/")[-1]
            doc_file_path = f"../load_docs/tenancy_services_pdfs/docs/{doc_file_name}"
            document = SimpleDirectoryReader(
                input_files=[doc_file_path],
                file_metadata=lambda _: {
                    "id": doc["id"],
                    "doc_url": doc["doc_url"],
                    "title": doc["title"],
                    "doc_type": doc["doc_type"],
                    "doc_sha256_hash": doc["doc_sha256_hash"],
                },
            ).load_data()
            documents += document
        except Exception as e:
            logging.error(f"Error loading document {doc['doc_url']}: {e}")

    if len(documents) > 0:
        logging.info(f"Adding {len(documents)} documents in the index")
        index.refresh_ref_docs(documents, service_context=service_context)

    logging.info(f"Skipped {skipped_docs} documents that were already in the index")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    dotenv.load_dotenv()
    index_docs()
