import { Message } from "ai";

import { Source } from "../types";
import { IconAI, IconUser } from "@/ui/icons";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ParsedMessage = {
  documents?: Source[];
} & Message;

export function ChatList({ messages }: { messages: Array<Message> }) {
  const parsedMessages = parseMessages(messages);
  return (
    <>
      {parsedMessages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? (
            <UserMessage>{message.content}</UserMessage>
          ) : (
            <BotMessage documents={message.documents}>
              {message.content}
            </BotMessage>
          )}
        </div>
      ))}
    </>
  );
}

export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {children}
      </div>
    </div>
  );
}

export function BotMessage({
  children,
  className,
  documents,
}: {
  children: React.ReactNode;
  className?: string;
  documents?: Source[];
}) {
  return (
    <div className="flex flex-col">
      <div
        className={cn("group relative flex items-start md:-ml-12", className)}
      >
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground">
          <IconAI />
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
          {children}
        </div>
      </div>
      {documents?.map((document) => (
        <a
          key={document.id}
          href={document.doc_url}
          className="block text-blue-500 underline"
          target="_blank"
        >
          {`${document.title} (page ${document.page_label})`}
        </a>
      ))}
    </div>
  );
}

function parseMessages(messages: Message[]): ParsedMessage[] {
  return messages.map((message) => {
    if (message.role === "user") {
      return message;
    } else {
      const [documentsString, content] = message.content.split("||||");
      const documents = JSON.parse(documentsString) as Array<Source>;
      return { ...message, content, documents };
    }
  });
}
