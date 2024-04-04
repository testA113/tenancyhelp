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
from llama_index.core.chat_engine.types import (
    StreamingAgentChatResponse,
)
from llama_index.core.retrievers import RouterRetriever
from llama_index.core.chat_engine.condense_plus_context import (
    CondensePlusContextChatEngine,
)
from tenancy_docs.index_docs.utils import get_embed_model
import json
from typing import Generator, List, Optional

from tenancy_docs.query_docs.node_post_processor import TopNodePostprocessor


def create_chat_engine():
    Settings.embed_model = get_embed_model()
    Settings.llm = OpenAI(model="gpt-3.5-turbo-0125")

    # load indexes for each source
    chroma_client = chromadb.PersistentClient(path="../index_docs/chroma_db")

    sources = [
        {
            "name": "tenancy_services_pdfs",
            "description": "useful for when you want to answer queries that require guides and forms based on New Zealand tenancy laws. The notices and guides are good for emails",
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
            llm=OpenAI(model="gpt-3.5-turbo-0125")
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


def format_sse(data: str, event=None) -> str:
    """Formats data for Server-Sent Events (SSE)."""
    msg = f"data: {data}\n\n"
    if event is not None:
        msg = f"event: {event}\n{msg}"
    return msg

# gets {"content": token} or {"role": "assistant"} and transforms into 
# `{"choices":[{"delta":{"content": token}}]}` or `{"choices":[{"delta":{"role": "assistant"}}]}` format
# https://platform.openai.com/docs/api-reference/chat/streaming
def format_token_to_openai_chat_completion_obj(delta: dict) -> str:
    if "content" in delta or "role" in delta or "documents" in delta:
        return json.dumps({"choices": [{"delta": delta, "index":0, "finish_reason":None}]})
    else:
        return json.dumps({"error": "Invalid delta format"})


def query_docs(
    chat_engine: CondensePlusContextChatEngine, message: str, chat_history: Optional[List[ChatMessage]]
) -> Generator[str, None, None]:
    """
    Queries the chat engine for relevant documents and yields the document information and response text.

    Args:
        chat_engine (CondensePlusContextChatEngine): The chat engine instance.
        message (str): The message to send to the chat engine.
        chat_history (Optional[List[ChatMessage]]): The chat history.

    Yields:
        str: The document information or response text in Server-Sent Events (SSE) format.

    Raises:
        Exception: If an error occurs during the query process.
    """
    try:
        logging.debug("Streaming response from chat engine")
        logging.debug(f"Message from user: {message}")
        
        # Iterate through the streaming response and yield the response text
        streaming_response: StreamingAgentChatResponse = chat_engine.stream_chat(message=message, chat_history=chat_history)

        logging.debug("getting response")

        # initially, set the role with no content
        yield format_sse(format_token_to_openai_chat_completion_obj({"role": "assistant", "content": ""}))

        # Yield relevant documents information as soon as it's available
        documents = []
        for node_with_score in streaming_response.source_nodes:
            metadata = node_with_score.node.metadata
            text = node_with_score.node.text
            document_info = {
                "id": node_with_score.node_id,
                "source": metadata.get("source", ""),
                "title": metadata.get("title", ""),
                "doc_url": metadata.get("doc_url", ""),
                "page_label": metadata.get("page_label", ""),
            }
            documents.append(document_info)
        logging.debug(f"Found documents: {documents}")
        yield format_sse(format_token_to_openai_chat_completion_obj({"content": f"{json.dumps(documents)}||||"})) # add a unique delimiter to separate the documents from the response

        # Yield the response text as soon as it's available
        full_response = ""
        for token in streaming_response.response_gen:
            full_response += token
            yield format_sse(format_token_to_openai_chat_completion_obj({"content": token}))
        logging.debug(f"Full response: {full_response}")

        # Stop events
        yield format_sse(data=json.dumps({"choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}))
        yield format_sse(data="[DONE]")


    except Exception as e:
        # log full stack trace
        print('wrong\n\n\n')
        # throw the error to the caller
        raise e

# used for testing purposes
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    dotenv.load_dotenv()
    chat_engine = create_chat_engine()

    message1 = "Create an email"
    response1 = query_docs(chat_engine, message1, [
        {
            "role": "user",
            "content": "The toilet is broken, what can I do to fix it as soon as possible?"
        }
    ])
    for response in response1:
        logging.info(response)
