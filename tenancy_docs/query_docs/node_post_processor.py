from typing import List, Optional

from llama_index.core.postprocessor.types import BaseNodePostprocessor
from llama_index.core.schema import NodeWithScore, QueryBundle


class TopNodePostprocessor(BaseNodePostprocessor):
    def _postprocess_nodes(
        self, nodes: List[NodeWithScore], _: Optional[QueryBundle]
    ) -> List[NodeWithScore]:
        filtered_nodes = []
        for node in nodes:
            # remove nodes with a score lower than 0.45 if the source is the tribunal_cases
            if (
                node.metadata.get("source", "") == "tribunal_cases"
                and node.score >= 0.42
            ):
                filtered_nodes.append(node)
            # otherwise, remove nodes with a score lower than 0.40
            elif (
                node.metadata.get("source", "") != "tribunal_cases"
                and node.score >= 0.40
            ):
                filtered_nodes.append(node)

        # sort nodes by score in descending order
        nodes = sorted(
            filtered_nodes,
            key=lambda x: x.score if x.score is not None else float("-inf"),
            reverse=True,
        )
        # select top 4 nodes
        nodes = nodes[:4]

        return nodes
