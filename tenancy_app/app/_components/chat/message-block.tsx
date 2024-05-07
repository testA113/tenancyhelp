import { ChatRequestOptions } from "ai";
import Markdown from "markdown-to-jsx";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { ChatHistoryEventType } from "@/models/chat-history-training";

import { ParsedMessage } from "./types";
import { UserMessage } from "./user-message";
import { BotMessage } from "./bot-message";

type Props = {
  message: ParsedMessage;
  reload: (
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => Promise<string | null | undefined>;
  stop: () => void;
  isLoading: boolean;
  onAddChatHistory: (eventType: ChatHistoryEventType) => void;
};

export function MessageBlock({
  message,
  reload,
  stop,
  isLoading,
  onAddChatHistory,
}: Props) {
  return (
    <>
      {message.role === "user" ? (
        <UserMessage>{message.content}</UserMessage>
      ) : (
        <BotMessage
          sources={message.annotations}
          isLoading={isLoading}
          messageContent={message.content}
          reload={reload}
          stop={stop}
          onAddChatHistory={onAddChatHistory}
        >
          {message.content && <Markdown>{message.content}</Markdown>}
        </BotMessage>
      )}
      <Separator className="my-4 last:hidden" />
    </>
  );
}
