from typing import List
import dotenv
from flask import Flask, request, Response
import logging
from llama_index.core.llms import ChatMessage

app = Flask(__name__)

# Import your existing functions here
from tenancy_docs.query_docs.query_docs import create_chat_engine, query_docs


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    chat_history_json = data.get("messages", [])

    # The chat history contains all messages except from the last one
    chat_history: List[ChatMessage] = []
    for chat_item in chat_history_json[:-1]:
        chat_history.append(ChatMessage(role=chat_item["role"], content=chat_item["content"]))

    # The message is the most recent user message
    message = chat_history_json[-1]["content"]

    # Use the generator function to stream the response and documents
    response_stream = query_docs(chat_engine=chat_engine, message=message, chat_history=chat_history)
    return Response(response_stream, mimetype="text/event-stream")

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    dotenv.load_dotenv()
    chat_engine = create_chat_engine()
    app.run(debug=True)
