import logging
import os
import dotenv
from llama_index import (
    Document,
    OpenAIEmbedding,
    VectorStoreIndex,
    SimpleDirectoryReader,
    ServiceContext,
)
from llama_index.vector_stores import ChromaVectorStore
from llama_index.storage.storage_context import StorageContext
from llama_index.embeddings import HuggingFaceEmbedding
import chromadb
from typing import List


from tenancy_docs.load_docs.tenancy_services_pdfs.utils import get_all_document_metadata


def index_docs():
    # load environment variables
    dotenv.load_dotenv()
    # import openai
    os.environ["TOKENIZERS_PARALLELISM"] = "false"

    OpenAIEmbedding.api_key = os.environ["OPENAI_API_KEY"]

    # create client and a new collection
    chroma_client = chromadb.EphemeralClient()
    chroma_collection = chroma_client.create_collection("quickstart")

    # define embedding function
    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")

    # load document info
    doc_db_rows = get_all_document_metadata(
        file_path="../load_docs/tenancy_services_pdfs/document_metadata.db"
    )

    # create the documents and add metadata to each one
    documents: List[Document] = []
    for doc in doc_db_rows:
        try:
            doc_file_name = doc["doc_url"].split("/")[-1]
            doc_file_path = f"../load_docs/tenancy_services_pdfs/pdfs/{doc_file_name}"
            document = SimpleDirectoryReader(
                input_files=[doc_file_path],
                file_metadata=lambda _: {
                    "doc_url": doc["doc_url"],
                    "title": doc["title"],
                    "doc_type": doc["doc_type"],
                    "doc_sha256_hash": doc["doc_sha256_hash"],
                },
            ).load_data()
            documents += document
        except Exception as e:
            logging.error(f"Error loading document {doc['doc_url']}: {e}")
    print(documents[0].metadata)

    # set up ChromaVectorStore and load in data
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    service_context = ServiceContext.from_defaults(embed_model=embed_model)
    index = VectorStoreIndex.from_documents(
        documents, storage_context=storage_context, service_context=service_context
    )

    # Query Data
    query_engine = index.as_query_engine()
    response = query_engine.query(
        "I accidentally sent the house on fire. Am I responsible for costs?"
    )
    print(response.source_nodes)
    print(response.response)


if __name__ == "__main__":
    index_docs()
