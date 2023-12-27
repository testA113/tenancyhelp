import sys
import os
import getpass
from llama_index import (
    Document,
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


def example():
    # import openai

    # os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
    # os.environ["TOKENIZERS_PARALLELISM"] = "false"

    # openai.api_key = os.environ["OPENAI_API_KEY"]

    # print(openai.api_key)

    # # create client and a new collection
    # chroma_client = chromadb.EphemeralClient()
    # chroma_collection = chroma_client.create_collection("quickstart")

    # # define embedding function
    # embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")

    # load documents
    doc_db_rows = get_all_document_metadata(
        file_path="../load_docs/tenancy_services_pdfs/document_metadata.db"
    )
    print(doc_db_rows[0]["title"])

    # create the documents
    documents = []
    for doc in doc_db_rows:
        
        documents.append(
            Document(
                doc["title"],
                doc["doc_type"],
                doc["doc_url"],
                doc["fetched_at"],
                doc["hash"],
            )
        )

    # documents = SimpleDirectoryReader("./data/paul_graham/").load_data()
    # print(documents[0])

    # # set up ChromaVectorStore and load in data
    # vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    # storage_context = StorageContext.from_defaults(vector_store=vector_store)
    # service_context = ServiceContext.from_defaults(embed_model=embed_model)
    # index = VectorStoreIndex.from_documents(
    #     documents, storage_context=storage_context, service_context=service_context
    # )

    # # Query Data
    # query_engine = index.as_query_engine()
    # response = query_engine.query("What did the author do growing up?")
    # print(response.response)


if __name__ == "__main__":
    example()
