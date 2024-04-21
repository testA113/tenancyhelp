import { useMutation } from "@tanstack/react-query";
import { Message } from "ai";

import {
  ChatHistoryEventType,
  HistoryMessage,
} from "@/models/chat-history-training";

export function useAddChatHistory() {
  return useMutation({
    mutationFn: async (body: {
      messages: Message[];
      eventType: ChatHistoryEventType;
    }) => addChatHistory(body),
    // We don't need to invalidate any queries after this mutation because they aren't shown in the UI
  });
}

async function addChatHistory({
  messages,
  eventType,
}: {
  messages: Message[];
  eventType: ChatHistoryEventType;
}) {
  const parsedMessages: HistoryMessage[] = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
  try {
    const response = await fetch("/api/chat-history-training", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: parsedMessages, eventType }),
    });
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add chat history.");
  }
}
