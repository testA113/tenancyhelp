import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { parseMessagesForRequest } from "./utils";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create an OpenAI API client (that's edge friendly!)
// but configure it to point to the local server
const client = new OpenAI({
  apiKey: "",
  baseURL: process.env.BASE_URL || "http://127.0.0.1:4321",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Rate limit the request
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "1 d"),
  });

  const { success, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_${ip}`
  );
  console.log(ip);
  console.log({ success, limit, reset, remaining });

  if (!success) {
    return new Response("You have reached your 20 message limit for the day.", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });
  }

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
