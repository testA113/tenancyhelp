import logging
import os
import dotenv
from llama_index import (
    OpenAIEmbedding,
    VectorStoreIndex,
    ServiceContext,
)
from llama_index.vector_stores import ChromaVectorStore
from llama_index.storage.storage_context import StorageContext
from llama_index.embeddings import HuggingFaceEmbedding
import chromadb
from typing import List


def query_docs():
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
    # define embedding function
    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
    # the loading and the querying should be in separate scripts
    # load from disk
    chroma_client = chromadb.PersistentClient(path="../index_docs/chroma_db")
    chroma_collection = chroma_client.get_or_create_collection("tenancy_docs")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    service_context = ServiceContext.from_defaults(embed_model=embed_model)
    index = VectorStoreIndex.from_vector_store(
        vector_store,
        service_context=service_context,
    )

    # Query Data
    query_engine = index.as_query_engine()
    response = query_engine.query(
        "I accidentally sent the house on fire. Am I responsible for costs?"
    )
    print(response.source_nodes)
    print(response.response)


if __name__ == "__main__":
    dotenv.load_dotenv()
    query_docs()
