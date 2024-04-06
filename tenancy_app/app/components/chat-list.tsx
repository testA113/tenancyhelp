import { Message } from "ai";

import { Source } from "../types";
import { IconAI, IconUser } from "@/ui/icons";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Separator } from "@/ui/separator";
import { FileTextIcon } from "@radix-ui/react-icons";

type ParsedMessage = {
  documents?: Source[];
} & Message;

export function ChatList({ messages }: { messages: Array<Message> }) {
  const parsedMessages = parseMessages(messages);
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {parsedMessages.map((message) => (
        <>
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === "user" ? (
              <UserMessage>{message.content}</UserMessage>
            ) : (
              <BotMessage sources={message.documents}>
                {message.content}
              </BotMessage>
            )}
          </div>
          <Separator className="my-4 last:hidden" />
        </>
      ))}
    </div>
  );
}

export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 py-1">
        {children}
      </div>
    </div>
  );
}

export function BotMessage({
  children,
  className,
  sources,
}: {
  children: React.ReactNode;
  className?: string;
  sources?: Source[];
}) {
  return (
    <div className="flex flex-col">
      <div className={cn("relative flex items-start md:-ml-12", className)}>
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground">
          <IconAI />
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 py-1">
          {children}
        </div>
      </div>
      <Sources sources={sources} />
    </div>
  );
}

function Sources({ sources }: { sources?: Source[] }) {
  if (!sources) {
    return null;
  }

  return (
    <div className="mt-4 ml-12 md:ml-0 grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
      {sources?.map((source) => (
        <Source key={source.id} source={source} />
      ))}
    </div>
  );
}

function Source({ source }: { source: Source }) {
  return (
    <div className="flex flex-col p-2 border rounded-lg bg-card">
      <div className="flex">
        <FileTextIcon className="h-4 w-auto mr-2 flex-none" />
        <a href={source.doc_url} target="_blank" className="underline">
          {source.title}
        </a>
      </div>
      <p className="text-muted-foreground text-sm ml-2">
        Page {source.page_label}
      </p>
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
      return { ...message, content: content.trim(), documents };
    }
  });
}
