FROM chromadb/chroma:latest as chroma

# copy the chroma_db directory from the chroma image
# TODO: this is a temporary solution, we should use a volume instead using a startup script
COPY ./chroma_db /chroma/chroma