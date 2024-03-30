import logging
import dotenv

from llama_index.core import Settings, VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.llms.anthropic import Anthropic
from llama_index.llms.openai import OpenAI
from llama_index.core.tools import RetrieverTool
import chromadb
from llama_index.core.selectors import (
    PydanticMultiSelector,
)
from llama_index.core.retrievers import RouterRetriever
from llama_index.core.chat_engine.condense_plus_context import (
    CondensePlusContextChatEngine,
)
from tenancy_docs.index_docs.utils import get_embed_model
import json
from typing import Generator

from tenancy_docs.query_docs.node_post_processor import TopNodePostprocessor


def create_chat_engine():
    Settings.embed_model = get_embed_model()
    Settings.llm = OpenAI(model="gpt-4")

    # load indexes for each source
    chroma_client = chromadb.PersistentClient(path="../index_docs/chroma_db")

    sources = [
        {
            "name": "tenancy_services_pdfs",
            "description": "useful for when you want to answer queries that require guides and forms based on New Zealand tenancy laws.",
        },
        {
            "name": "tribunal_cases",
            "description": "useful for creating emails or when asked about similar tenancy tribunal cases directly. Don't use this for general tenancy queries.",
        },
        {
            "name": "residential_tenancies_act",
            "description": "the source of truth for New Zealand tenancy laws. The tribunal cases and tenancy services guides and forms are based on it.",
        },
    ]

    retriever_tools: list[RetrieverTool] = []
    for source in sources:
        collection = chroma_client.get_or_create_collection(source["name"])
        logging.debug(f"Found {collection.count()} {source['name'].replace('_', ' ')}")

        vector_store = ChromaVectorStore(chroma_collection=collection)
        index = VectorStoreIndex.from_vector_store(vector_store)
        retriever = index.as_retriever(similarity_top_k=2)
        retriever_tool = RetrieverTool.from_defaults(
            retriever=retriever,
            description=source["description"],
        )
        retriever_tools.append(retriever_tool)

    retriever = RouterRetriever(
        selector=PydanticMultiSelector.from_defaults(
            llm=OpenAI(model="gpt-3.5-turbo-1106")
        ),
        retriever_tools=retriever_tools,
    )
    logging.debug("Retriever tool created", extra={"retriever_tools": retriever_tools})

    node_postprocessor = TopNodePostprocessor()
    chat_engine = CondensePlusContextChatEngine.from_defaults(
        retriever=retriever,
        condense_question_prompt=None,
        node_postprocessors=[node_postprocessor],
        chat_history=None,
        system_prompt="You are tenancy advisor who helps tenants resolve disputes with their landlords. Your answers must only apply to tenants and not landlords. You always reference supporting documents and forms (include the relevant title and page numbers). You are empathetic and always try to help the tenant resolve their issue. You are a good listener and must always ask clarifying questions to understand the tenant's situation.",
    )
    return chat_engine


def chat(chat_engine: CondensePlusContextChatEngine):
    chat_engine.chat_repl()


def format_sse(data: str, event=None) -> str:
    """Formats data for Server-Sent Events (SSE)."""
    msg = f"data: {data}\n\n"
    if event is not None:
        msg = f"event: {event}\n{msg}"
    return msg


def query_docs(
    chat_engine: CondensePlusContextChatEngine, message: str
) -> Generator[str, None, None]:
    try:
        streaming_response = chat_engine.stream_chat(message=message)

        # Yield relevant documents information as soon as it's available
        documents = []
        for node_with_score in streaming_response.source_nodes:
            metadata = node_with_score.node.metadata
            print(node_with_score.node.metadata)
            document_info = {
                "title": metadata.get("title", ""),
                "doc_url": metadata.get("doc_url", ""),
                "page_label": metadata.get("page_label", ""),
            }
            documents.append(document_info)
            yield format_sse(json.dumps({"documents": documents}), event="document")

        # Yield the response text as soon as it's available
        full_response = ""
        for token in streaming_response.response_gen:
            full_response += token
            yield format_sse(json.dumps({"response": full_response}), event="response")


    except Exception as e:
        # log full stack trace
        logging.exception(e)
        yield format_sse(json.dumps({"error": str(e)}), event="error")

# used for testing purposes
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    dotenv.load_dotenv()
    chat_engine = create_chat_engine()

    message1 = "The toilet is broken, what can I do to fix it as soon as possible?"
    response1 = query_docs(chat_engine, message1)
    for response in response1:
        logging.info(response)
