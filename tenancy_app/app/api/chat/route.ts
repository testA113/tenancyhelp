import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../auth/[...nextauth]/auth-config";

import { parseMessagesForRequest } from "./utils";

// Create an OpenAI API client (that's edge friendly!)
// but configure it to point to the local server
const client = new OpenAI({
  apiKey: "",
  baseURL: process.env.QUERY_URL || "http://127.0.0.1:4321",
});

export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "UnAuthorized" }, { status: 404 });
  }

  // Rate limit the request
  const rateLimit = Number(process.env.CHAT_MESSAGE_DAILY_LIMIT) || 20;
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(rateLimit, "1 d"),
  });

  const { success, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_${ip}`
  );
  console.log(ip);
  console.log({ success, limit, reset, remaining });

  if (!success) {
    return new Response(
      `You have reached your ${rateLimit} message limit for the day.`,
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
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
