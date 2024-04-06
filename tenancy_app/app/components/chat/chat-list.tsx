import { Message } from "ai";

import { parseMessages } from "./utils";
import { BotMessage, ChatResponseLoading, MessageBlock } from "./message-block";

type Props = {
  messages: Array<Message>;
  isLoading: boolean;
  error?: Error;
};

export function ChatList({ messages, isLoading, error }: Props) {
  const parsedMessages = parseMessages(messages);
  const isUserMessageLast =
    parsedMessages[parsedMessages.length - 1]?.role === "user";
  return (
    <div className="relative mx-auto max-w-2xl px-4 whitespace-pre-wrap">
      {parsedMessages.map((message) => (
        <MessageBlock
          key={message.id}
          message={message}
          isLoading={isLoading}
        />
      ))}
      {isUserMessageLast && isLoading ? (
        <BotMessage sources={[]} isLoading={isLoading}>
          <ChatResponseLoading loadingMessage="Loading sources"></ChatResponseLoading>
        </BotMessage>
      ) : null}
      {error && (
        <BotMessage sources={[]} isLoading={false} className="text-red-500">
          {error.message}
        </BotMessage>
      )}
      {isUserMessageLast && !isLoading && !error ? (
        <BotMessage sources={[]} isLoading={isLoading} className="text-red-500">
          Sorry, something went wrong. Try again?
        </BotMessage>
      ) : null}
    </div>
  );
}
