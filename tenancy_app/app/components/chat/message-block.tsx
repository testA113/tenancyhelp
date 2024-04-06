import { ParsedMessage, ParsedSource } from "./types";
import { IconAI, IconUser } from "@/ui/icons";
import { cn, pluralise } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import { FileTextIcon } from "@radix-ui/react-icons";
import { spinner } from "@/ui/spinner";
import { Separator } from "@/ui/separator";

type Props = {
  message: ParsedMessage;
  isLoading: boolean;
};

export function MessageBlock({ message, isLoading }: Props) {
  return (
    <>
      {message.role === "user" ? (
        <UserMessage>{message.content}</UserMessage>
      ) : (
        <BotMessage sources={message.sources} isLoading={isLoading}>
          {message.content}
        </BotMessage>
      )}
      <Separator className="my-4 last:hidden" />
    </>
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
  return (
    <div className="flex flex-col">
      <div className={cn("relative flex items-start md:-ml-12", className)}>
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground">
          <IconAI />
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 py-1">
          {isLoading && !children ? (
            <ChatResponseLoading loadingMessage="Thinking" />
          ) : (
            children
          )}
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

export function ChatResponseLoading({ loadingMessage = "Thinking" }) {
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
