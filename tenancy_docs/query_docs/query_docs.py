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
from llama_index.core.llms import MessageRole

from tenancy_docs.query_docs.node_post_processor import TopNodePostprocessor


def create_chat_engine():
    # llm = OpenAI(model="gpt-4")
    # llm = OpenAI(model="gpt-3.5-turbo-1106")  # 16k tokens

    # load indexes for each source
    chroma_client = chromadb.PersistentClient(path="../index_docs/chroma_db")

    sources = [
        {
            "name": "tenancy_services_pdfs",
            "description": "useful for when you want to answer queries that require guides and forms based on New Zealand tenancy laws.",
        },
        {
            "name": "tribunal_cases",
            "description": "useful for creating emails or when asked about similar tenancy tribunal cases directly.",
        },
        {
            "name": "residential_tenancies_act",
            "description": "the source of truth for New Zealand tenancy laws. The tribunal cases and tenancy services guides and forms are based on it.",
        },
    ]

    retriever_tools = []
    for source in sources:
        collection = chroma_client.get_or_create_collection(source["name"])
        logging.info(f"Found {collection.count()} {source['name'].replace('_', ' ')}")

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


def query_docs(chat_engine: CondensePlusContextChatEngine, message: str):
    streaming_response = chat_engine.stream_chat(message=message)
    # print out the source nodes
    for node_with_score in streaming_response.source_nodes:
        print(node_with_score.node.metadata)
    print("\n\n")

    # print out the response
    for token in streaming_response.response_gen:
        print(token, end="")
    print("\n\n-----\n\n")

    # create a chat message to add to the char history
    message_content = "".join(token for token in streaming_response.response_gen)
    chat_message = ChatMessage(role=MessageRole.USER, content=message_content)
    chat_engine.chat_history.append(chat_message)


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    dotenv.load_dotenv()
    # tokenizer = Anthropic().tokenizer
    # Settings.tokenizer = tokenizer
    Settings.embed_model = get_embed_model()
    Settings.llm = Anthropic(temperature=0.0, model="claude-3-opus-20240229")
    chat_engine = create_chat_engine()

    chat(chat_engine=chat_engine)

    # message1 = "The toilet is broken, what can I do to fix it as soon as possible?"
    # query_docs(chat_engine=chat_engine, message=message1)
