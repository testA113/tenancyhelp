from llama_index.schema import NodeWithScore, QueryBundle
from typing import List, Optional
from llama_index.postprocessor.types import BaseNodePostprocessor


class TopNodePostprocessor(BaseNodePostprocessor):
    def _postprocess_nodes(
        self, nodes: List[NodeWithScore], _: Optional[QueryBundle]
    ) -> List[NodeWithScore]:
        # sort nodes by score in descending order
        nodes = sorted(
            nodes,
            key=lambda x: x.score if x.score is not None else float("-inf"),
            reverse=True,
        )
        # select top 3 nodes
        nodes = nodes[:3]

        return nodes
