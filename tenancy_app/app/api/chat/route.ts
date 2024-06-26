import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { parseMessagesForRequest } from "./utils";

// Create an OpenAI API client (that's edge friendly!)
// but configure it to point to the local server
const client = new OpenAI({
  apiKey: "",
  baseURL: process.env.QUERY_URL || "http://127.0.0.1:4321",
});

export async function POST(req: Request) {
  // Rate limit the request
  const rateLimit = Number(process.env.CHAT_MESSAGE_DAILY_LIMIT) || 20;
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const rateLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(rateLimit, "1 d"),
  });

  const { success, limit, reset, remaining } = await rateLimiter.limit(
    `ratelimit_${ip}`
  );
  console.log(ip);
  console.log({ success, limit, reset, remaining });

  if (!success) {
    return new Response(
      `Sadly, I'm not made of money and I have to limit use per person. You have reached your ${rateLimit} message daily limit. Please help TenancyHelp increase the limits by clicking the 'thumbs up' on any good advice you get. This will train a better model and reduce the costs so I can increase the limit.`,
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
  const { messages, data } = await req.json();

  // validate recaptchav3 token with a score above 0.5
  try {
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?${new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY || "",
        response: data.token,
      })}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const recaptchaData = await recaptchaResponse.json();
    console.log(recaptchaData);
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return new Response("Recaptcha failed", { status: 403 });
    }
  } catch {
    console.error("Recaptcha failed");
    return new Response("Recaptcha failed", { status: 403 });
  }

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
