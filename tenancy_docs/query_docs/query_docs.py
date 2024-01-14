import logging
import dotenv
from llama_index import (
    VectorStoreIndex,
    ServiceContext,
)
from llama_index.vector_stores import ChromaVectorStore
from llama_index.llms import OpenAI, ChatMessage, MessageRole
from llama_index.tools import ToolMetadata, RetrieverTool
import chromadb
from llama_index.selectors.pydantic_selectors import (
    PydanticMultiSelector,
)
from llama_index.retrievers import RouterRetriever
from llama_index.chat_engine.condense_plus_context import CondensePlusContextChatEngine


from tenancy_docs.index_docs.utils import get_embed_model
from llama_index.llms import MessageRole


def create_chat_engine():
    embed_model = get_embed_model()

    # load indexes for each source
    service_context = ServiceContext.from_defaults(embed_model=embed_model)
    chroma_client = chromadb.PersistentClient(path="../index_docs/chroma_db")

    sources = [
        {
            "name": "tenancy_services_pdfs",
            "description": "useful for when you want to answer queries that require guides and advice based on New Zealand tenancy laws.",
        },
        {
            "name": "tribunal_cases",
            "description": "useful for when you want to answer queries that require information about past tribunal cases that are similar to the situation the user is in.",
        },
    ]

    retriever_tools = []
    for source in sources:
        collection = chroma_client.get_or_create_collection(source["name"])
        logging.info(f"Found {collection.count()} {source['name'].replace('_', ' ')}")

        vector_store = ChromaVectorStore(chroma_collection=collection)
        index = VectorStoreIndex.from_vector_store(
            vector_store, service_context=service_context
        )
        retriever = index.as_retriever(
            service_context=service_context, similarity_top_k=3
        )
        retriever_tool = RetrieverTool.from_defaults(
            retriever=retriever,
            description=source["description"],
        )
        retriever_tools.append(retriever_tool)

    # llm = OpenAI(model="gpt-4")
    llm = OpenAI(model="gpt-3.5-turbo-0613")
    retriever = RouterRetriever(
        selector=PydanticMultiSelector.from_defaults(llm=llm),
        retriever_tools=retriever_tools,
    )
    chat_engine = CondensePlusContextChatEngine.from_defaults(
        retriever=retriever,
        condense_question_prompt=None,
        chat_history=None,
        # verbose=True,
        service_context=service_context,
        system_prompt="Act as tenancy advisor in a community law centre. You are helping a tenant resolve a tenancy issue. Ensure to  reference supporting documents, and be concise including relevant page numbers or sections. If the supporting documents are not relevant, you should ask for more specific information.",
    )
    return chat_engine


def query_docs(chat_engine: CondensePlusContextChatEngine, message: str):
    response = chat_engine.chat(message=message)
    print(response)
    # get all source node metadata
    for source_node in response.source_nodes:
        print(source_node.metadata)
    print("\n\n")
    print(response.source_nodes)
    print("\n\n-----\n\n")
    # create a chat message to add to the char history
    chat_message = ChatMessage(role=MessageRole.USER, content=response)
    chat_engine.chat_history.append(chat_message)


if __name__ == "__main__":
    dotenv.load_dotenv()
    chat_engine = create_chat_engine()
    message1 = "I didn't get my bond back what should I do?"
    query_docs(chat_engine=chat_engine, message=message1)
    message2 = "What else can I do?"
    query_docs(chat_engine=chat_engine, message=message2)
    message3 = "Please create a draft email to my landlord requesting my bond back."
    query_docs(chat_engine=chat_engine, message=message3)
