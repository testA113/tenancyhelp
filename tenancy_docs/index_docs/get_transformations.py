from typing import List
from llama_index.extractors import (
    SummaryExtractor,
)
from llama_index.text_splitter import TokenTextSplitter
from llama_index.llms import OpenAI
from llama_index.ingestion import IngestionPipeline
from llama_index.schema import TransformComponent


def get_transformations() -> List[TransformComponent]:
    llm = OpenAI(model="gpt-3.5-turbo-1106")

    return [
        SummaryExtractor(summaries=["prev", "self", "next"], llm=llm),
    ]
