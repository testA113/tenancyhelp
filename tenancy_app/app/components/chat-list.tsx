import { Message } from "ai";

import { ParsedSource, Source } from "../types";
import { IconAI, IconUser } from "@/ui/icons";
import { cn } from "@/lib/utils";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { Separator } from "@/ui/separator";
import { FileTextIcon } from "@radix-ui/react-icons";
import { spinner } from "./ui/spinner";

type ParsedMessage = {
  sources?: Array<ParsedSource>;
} & Message;

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
        <>
          <Fragment key={message.id}>
            {message.role === "user" ? (
              <UserMessage>{message.content}</UserMessage>
            ) : (
              <BotMessage sources={message.sources} isLoading={isLoading}>
                {message.content}
              </BotMessage>
            )}
            <Separator className="my-4 last:hidden" />
          </Fragment>
        </>
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
    </div>
  );
}

export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-secondary">
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
  isLoading,
  className,
  sources,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
  sources?: Array<ParsedSource>;
}) {
  console.log(isLoading);
  return (
    <div className="flex flex-col">
      <div className={cn("relative flex items-start md:-ml-12", className)}>
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground">
          <IconAI />
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 py-1">
          {isLoading && !children ? <ChatResponseLoading /> : children}
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
    <div className="mt-4 ml-12 md:ml-0 grid grid-cols-1 md:grid-cols-2 gap-2">
      {sources?.map((source) => (
        <Source key={source.id} source={source} />
      ))}
    </div>
  );
}

function Source({ source }: { source: ParsedSource }) {
  return (
    <div className="flex flex-col p-2 border rounded-lg bg-card">
      <div className="flex mb-2">
        <FileTextIcon className="h-6 w-auto p-1 flex-none" />
        <a href={source.doc_url} target="_blank" className="underline">
          {source.title}
        </a>
      </div>
      <p className="ml-6 text-muted-foreground text-sm mb-2">
        {pluralise(source.page_labels.length, "Page", "Pages")}{" "}
        {source.page_labels.join(", ")}
      </p>
    </div>
  );
}

function ChatResponseLoading({ loadingMessage = "Thinking" }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((dots) => (dots.length < 3 ? dots + "." : ""));
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return (
    <p className="flex text-muted-foreground">
      {spinner}
      <span className="ml-1">
        {loadingMessage}
        {dots}
      </span>
    </p>
  );
}

function pluralise(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
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
      if (existingSource.page_labels.includes(source.page_label)) {
        return acc;
      }
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
