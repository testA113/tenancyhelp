from typing import List
from llama_index.core.extractors import (
    SummaryExtractor,
)
from llama_index.llms.openai import OpenAI
from llama_index.core.schema import TransformComponent


def get_transformations() -> List[TransformComponent]:
    llm = OpenAI(model="gpt-3.5-turbo-1106")

    return [
        SummaryExtractor(summaries=["prev", "self", "next"], llm=llm),
    ]
