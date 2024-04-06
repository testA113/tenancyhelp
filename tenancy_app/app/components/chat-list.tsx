import { Message } from "ai";

import { ParsedSource, Source } from "../types";
import { IconAI, IconUser } from "@/ui/icons";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Separator } from "@/ui/separator";
import { FileTextIcon } from "@radix-ui/react-icons";

type ParsedMessage = {
  sources?: Array<ParsedSource>;
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
              <BotMessage sources={message.sources}>
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
  sources?: Array<ParsedSource>;
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

function Sources({ sources }: { sources?: Array<ParsedSource> }) {
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

function Source({ source }: { source: ParsedSource }) {
  return (
    <div className="flex flex-col p-2 border rounded-lg bg-card">
      <div className="flex">
        <FileTextIcon className="h-4 w-auto mr-2 flex-none" />
        <a href={source.doc_url} target="_blank" className="underline">
          {source.title}
        </a>
      </div>
      <p className="text-muted-foreground text-sm ml-2">
        Page {source.page_labels.join(", ")}
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
      return {
        ...message,
        content: content.trim(),
        sources: parseSources(documents),
      };
    }
  });
}

function parseSources(sources: Array<Source>): Array<ParsedSource> {
  // if there is a document with the same url, we group them together and combine the page labels in an array
  const groupedSources = sources.reduce((acc, source) => {
    const existingSource = acc.find((d) => d.doc_url === source.doc_url);
    if (existingSource) {
      const newSortedPageLabels = [
        ...existingSource.page_labels,
        source.page_label,
      ].sort((a, b) => Number(a) - Number(b));
      existingSource.page_labels = newSortedPageLabels;
    } else {
      acc.push({ ...source, page_labels: [source.page_label] });
    }
    return acc;
  }, [] as Array<ParsedSource>);

  return groupedSources;
}
