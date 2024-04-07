import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { parseMessagesForRequest } from "./utils";

// Create an OpenAI API client (that's edge friendly!)
// but configure it to point to the local server
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: "http://127.0.0.1:4321",
});
// IMPORTANT! Set the runtime to edge
export const runtime = "edge";
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // For each bot message, remove the sources string
  const parsedMessages = parseMessagesForRequest(messages);

  const response = await client.chat.completions.create({
    model: "asdf", // doesn't reach api yet
    stream: true,
    max_tokens: 1000,
    messages: parsedMessages,
  });
  // Convert the response into a friendly text-stream.
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
