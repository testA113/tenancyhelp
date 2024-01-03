from llama_index.embeddings import HuggingFaceEmbedding


def get_embed_model():
    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
    return embed_model
