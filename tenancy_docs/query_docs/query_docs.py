import dotenv
from llama_index import (
    VectorStoreIndex,
    ServiceContext,
)
from llama_index.vector_stores import ChromaVectorStore
import chromadb

from tenancy_docs.index_docs.utils import get_embed_model


def query_docs():
    embed_model = get_embed_model()

    # load from disk
    chroma_client = chromadb.PersistentClient(path="../index_docs/chroma_db")
    chroma_collection = chroma_client.get_or_create_collection("tenancy_services_docs")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    service_context = ServiceContext.from_defaults(embed_model=embed_model)
    index = VectorStoreIndex.from_vector_store(
        vector_store,
        service_context=service_context,
    )

    # Query Data
    query_engine = index.as_query_engine(similarity_top_k=3, streaming=True)
    response = query_engine.query(
        "I accidentally set the house on fire. Am I responsible for costs?"
    )
    nodes = response.source_nodes
    if len(nodes) == 0:
        print("No results found")
        return
    doc_metadata = [node.metadata for node in nodes]
    doc_similarity_scores = [node.score for node in nodes]
    print(doc_metadata)
    print("\n")
    # stream the results
    print("Streaming response...")
    response.print_response_stream()


if __name__ == "__main__":
    dotenv.load_dotenv()
    query_docs()
