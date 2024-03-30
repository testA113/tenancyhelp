import dotenv
from flask import Flask, request, Response
import logging
import queue

app = Flask(__name__)

# Import your existing functions here
from tenancy_docs.query_docs.query_docs import create_chat_engine, query_docs


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")

    # Use the generator function to stream the response and documents
    response_stream = query_docs(chat_engine, message)
    return Response(response_stream, mimetype="text/event-stream")

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    dotenv.load_dotenv()
    chat_engine = create_chat_engine()
    app.run(debug=True)
