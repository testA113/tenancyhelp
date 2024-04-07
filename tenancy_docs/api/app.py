from typing import List
import dotenv
from flask import Flask, request, Response
import logging
from llama_index.core.llms import ChatMessage

from tenancy_docs.query_docs.query_docs import create_chat_engine, query_docs

# Load environment variables
dotenv.load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

# Create chat engine
chat_engine = create_chat_engine()

# Initialize Flask application
app = Flask(__name__)


@app.route("/chat/completions", methods=["POST"])
def chat():
    """
    Endpoint to handle chat requests. It receives a POST request with a JSON body.
    The JSON should contain a "messages" field which is a list of messages.
    Each message should be a dictionary with a "role" and "content" field.
    The "role" can be "user" or "assistant", and "content" is the message text.
    The function returns a stream of responses from the chat engine.
    """
    # Get JSON data from request
    data = request.get_json()
    if not data:
        logging.error("No data received in request")
        return {"error": "No data received in request"}, 400

    # Get chat history from data
    chat_history_json = data.get("messages", [])
    if not chat_history_json:
        logging.error("No messages received in request")
        return {"error": "No messages received in request"}, 400

    # Convert chat history to list of ChatMessage objects
    chat_history: List[ChatMessage] = []
    for chat_item in chat_history_json[:-1]:
        role = chat_item.get("role")
        if role not in ["user", "assistant"]:
            logging.error(f"Invalid role: {role}")
            return {
                "error": f"Invalid role: {role}. Role can only be 'user' or 'assistant'."
            }, 400
        chat_history.append(ChatMessage(role=role, content=chat_item["content"]))

    # Get the latest message from the chat history
    message = chat_history_json[-1].get("content")
    if not message:
        logging.error("No message received in request")
        return {"error": "No message received in request"}, 400

    # Query chat engine and return response stream
    try:
        response_stream = query_docs(
            chat_engine=chat_engine, message=message, chat_history=chat_history
        )
        return Response(response_stream, mimetype="text/event-stream")
    except Exception as e:
        logging.exception(e)
        return {"error": "No messages received in request"}, 500


if __name__ == "__main__":
    app.run(debug=True, port="4321")
