import logging
from typing import Dict
import dotenv
from llama_index import (
    VectorStoreIndex,
    ServiceContext,
)
from llama_index.vector_stores import ChromaVectorStore
from llama_index.llms import OpenAI, ChatMessage
from llama_index.tools import QueryEngineTool, ToolMetadata
from llama_index.agent.openai.base import OpenAIAgent as YourOpenAIAgent
import chromadb

from tenancy_docs.index_docs.utils import get_embed_model


def query_docs():
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
    query_engine_tools = []

    for source in sources:
        collection = chroma_client.get_or_create_collection(source["name"])
        logging.info(f"Found {collection.count()} {source['name'].replace('_', ' ')}")

        vector_store = ChromaVectorStore(chroma_collection=collection)
        index = VectorStoreIndex.from_vector_store(
            vector_store, service_context=service_context
        )
        query_engine = index.as_query_engine(
            similarity_top_k=3, service_context=service_context
        )
        query_engine_tool = QueryEngineTool(
            query_engine=query_engine,
            metadata=ToolMetadata(
                name=source["name"],
                description=source["description"]
                + " Use a detailed plain text question as input to the tool.",
            ),
        )
        query_engine_tools.append(query_engine_tool)

    llm = OpenAI(model="gpt-3.5-turbo-0613")
    agent = YourOpenAIAgentWithSources(tools=query_engine_tools, llm=llm, verbose=True)
    response = agent.chat_with_sources(
        "I accidentally set the house on fire. Am I responsible for costs?"
    )
    # print the response keys
    print(response)


class YourOpenAIAgentWithSources(YourOpenAIAgent):
    def __init__(self, tools, llm, verbose=False):
        super().__init__(
            tools=tools,
            llm=llm,
            verbose=verbose,
            memory=None,
            prefix_messages=False,
        )
        self.tools = tools  # Store the tools in an instance variable

    def chat_with_sources(self, message: str) -> Dict:
        # # Store the source nodes from each tool
        # source_nodes = []
        # for tool in self.tools:
        #     nodes = tool.query_engine.retrieve(message)
        #     source_nodes.extend(nodes)

        # # Append the source nodes to the response
        # response_with_sources = {"response": response, "source_nodes": source_nodes}
        # return response_with_sources

        # Get the chat response as usual
        response = self.chat(message=message)
        return response


if __name__ == "__main__":
    dotenv.load_dotenv()
    query_docs()
