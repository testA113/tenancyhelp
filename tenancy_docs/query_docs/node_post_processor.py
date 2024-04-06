from llama_index.core.schema import NodeWithScore, QueryBundle
from typing import List, Optional
from llama_index.core.postprocessor.types import BaseNodePostprocessor


class TopNodePostprocessor(BaseNodePostprocessor):
    def _postprocess_nodes(
        self, nodes: List[NodeWithScore], _: Optional[QueryBundle]
    ) -> List[NodeWithScore]:
        filteredNodes = []
        for node in nodes:
            # remove nodes with a score lower than 0.55 if the source is the tribunal_cases
            if (
                node.metadata.get("source", "") == "tribunal_cases"
                and node.score >= 0.55
            ):
                filteredNodes.append(node)
            # otherwise, remove nodes with a score lower than 0.45
            elif (
                node.metadata.get("source", "") != "tribunal_cases"
                and node.score >= 0.45
            ):
                filteredNodes.append(node)

        # sort nodes by score in descending order
        nodes = sorted(
            filteredNodes,
            key=lambda x: x.score if x.score is not None else float("-inf"),
            reverse=True,
        )
        # select top 4 nodes
        nodes = nodes[:4]

        return nodes
