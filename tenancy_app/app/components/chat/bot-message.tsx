import { cn, pluralise } from "@/app/lib/utils";
import { FileTextIcon, ReloadIcon, StopIcon } from "@radix-ui/react-icons";
import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/ui/button";
import { IconAI, IconCopy, IconCheck } from "@/ui/icons";
import { ParsedSource } from "./types";
import { ChatResponseLoading } from "./loading-message";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { useChat } from "ai/react";
import { ChatRequestOptions } from "ai";

export function BotMessage({
  children, // the full message and components
  messageContent, // the message string to use for the clipboard
  reload,
  stop,
  isLoading,
  className,
  sources,
}: {
  children: ReactNode;
  messageContent?: string;
  reload: (
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => Promise<string | null | undefined>;
  stop: () => void;
  isLoading: boolean;
  className?: string;
  sources?: Array<ParsedSource>;
}) {
  const isComplete = !isLoading && messageContent;

  return (
    <div className="flex flex-col">
      <div className={cn("relative flex items-start md:-ml-12", className)}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground">
            <IconAI />
          </div>
          {isLoading && <StopButton stop={stop} />}
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 py-1">
          {isLoading && !children ? (
            <ChatResponseLoading loadingMessage="Thinking" />
          ) : (
            children
          )}
        </div>
      </div>
      {!isLoading && (
        <CompletedActions
          messageContent={messageContent}
          reload={reload}
          stop={stop}
        />
      )}
      {!!sources?.length && <Sources sources={sources} />}
    </div>
  );
}

function Sources({ sources }: { sources: Array<ParsedSource> }) {
  if (!sources) {
    return null;
  }

  return (
    <div className="my-4 ml-12 md:ml-0 grid grid-cols-1 md:grid-cols-2 gap-2">
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

function StopButton({ stop }: { stop: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" size="icon" variant="ghost" onClick={stop}>
          <StopIcon />
          <span className="sr-only">Stop</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Stop</TooltipContent>
    </Tooltip>
  );
}

function CompletedActions({
  messageContent,
  reload,
}: {
  messageContent?: string;
  reload: (
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => Promise<string | null | undefined>;
  stop: () => void;
}) {
  const [showSuccessfulCopy, setShowSuccessfulCopy] = useState(false);

  useEffect(() => {
    if (showSuccessfulCopy) {
      const timer = setTimeout(() => {
        setShowSuccessfulCopy(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessfulCopy]);

  return (
    <div className="w-full flex gap-x-2">
      {/* copy output */}
      {!!messageContent && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleCopyClick}
            >
              {!showSuccessfulCopy && <IconCopy />}
              {showSuccessfulCopy && <IconCheck />}
              <span className="sr-only">Copy advice</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy advice</TooltipContent>
        </Tooltip>
      )}
      {/* retry output (delete message and submit previous one again) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => reload()}
          >
            <ReloadIcon />
            <span className="sr-only">Rewrite</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Rewrite</TooltipContent>
      </Tooltip>
    </div>
  );

  function handleCopyClick(): void {
    if (messageContent) {
      // copy the full message (children) to the clipboard
      navigator.clipboard.writeText(messageContent);
      setShowSuccessfulCopy(true);
    }
  }
}
