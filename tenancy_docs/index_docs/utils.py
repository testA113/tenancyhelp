from llama_index.core.embeddings import resolve_embed_model


def get_embed_model():
    return resolve_embed_model("local:BAAI/bge-base-en-v1.5")
