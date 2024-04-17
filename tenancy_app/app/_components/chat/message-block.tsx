import { ParsedMessage } from "./types";
import { Separator } from "@/app/_components/ui/separator";
import { UserMessage } from "./user-message";
import { BotMessage } from "./bot-message";
import { ChatRequestOptions } from "ai";

type Props = {
  message: ParsedMessage;
  reload: (
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => Promise<string | null | undefined>;
  stop: () => void;
  isLoading: boolean;
};

export function MessageBlock({ message, reload, stop, isLoading }: Props) {
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
        >
          {message.content}
        </BotMessage>
      )}
      <Separator className="my-4 last:hidden" />
    </>
  );
}
