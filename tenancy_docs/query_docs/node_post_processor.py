from llama_index.core.schema import NodeWithScore, QueryBundle
from typing import List, Optional
from llama_index.core.postprocessor.types import BaseNodePostprocessor


class TopNodePostprocessor(BaseNodePostprocessor):
    def _postprocess_nodes(
        self, nodes: List[NodeWithScore], _: Optional[QueryBundle]
    ) -> List[NodeWithScore]:
        print(node.score for node in nodes)
        # remove nodes with a score lower than 0.55 if the source is the tribunal_cases
        filteredNodes = [
            node
            for node in nodes
            if node.metadata.get("source", "") != "tribunal_cases" or node.score >= 0.55
        ]
        # sort nodes by score in descending order
        nodes = sorted(
            filteredNodes,
            key=lambda x: x.score if x.score is not None else float("-inf"),
            reverse=True,
        )
        # select top 4 nodes
        nodes = nodes[:4]

        return nodes
