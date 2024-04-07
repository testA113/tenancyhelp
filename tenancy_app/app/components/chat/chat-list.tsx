import { ChatRequestOptions, Message } from "ai";

import { parseMessagesForChat } from "./utils";
import { MessageBlock } from "./message-block";
import { BotMessage } from "./bot-message";
import { ChatResponseLoading } from "./loading-message";

type Props = {
  messages: Array<Message>;
  reload: (
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => Promise<string | null | undefined>;
  stop: () => void;
  isLoading: boolean;
  error?: Error;
};

export function ChatList({ messages, reload, stop, isLoading, error }: Props) {
  const parsedMessages = parseMessagesForChat(messages);
  const isUserMessageLast =
    parsedMessages[parsedMessages.length - 1]?.role === "user";

  return (
    <div className="relative mx-auto max-w-2xl px-4 whitespace-pre-wrap">
      {parsedMessages.map((message) => (
        <MessageBlock
          key={message.id}
          message={message}
          isLoading={isLoading}
          reload={reload}
          stop={stop}
        />
      ))}
      {isUserMessageLast && isLoading ? (
        <BotMessage
          sources={[]}
          isLoading={isLoading}
          stop={stop}
          reload={reload}
        >
          <ChatResponseLoading loadingMessage="Loading sources"></ChatResponseLoading>
        </BotMessage>
      ) : null}
      {error && (
        <BotMessage
          sources={[]}
          isLoading={false}
          className="text-red-500"
          stop={stop}
          reload={reload}
        >
          {error.message}
        </BotMessage>
      )}
      {isUserMessageLast && !isLoading && !error ? (
        <BotMessage
          sources={[]}
          isLoading={isLoading}
          className="text-red-500"
          stop={stop}
          reload={reload}
        >
          Sorry, something went wrong. Try again?
        </BotMessage>
      ) : null}
    </div>
  );
}
