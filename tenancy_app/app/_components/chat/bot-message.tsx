import {
  Copy,
  CopyCheck,
  RefreshCw,
  Square,
  FileText,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { ChatRequestOptions } from "ai";

import { cn, pluralise } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ParsedSource } from "./types";
import { ChatResponseLoading } from "./loading-message";

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
  return (
    <div className="flex flex-col">
      <div className={cn("relative flex items-start md:-ml-12", className)}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
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
        <FileText className="h-6 w-auto p-1 flex-none" />
        <a
          href={`${source.doc_url}#page=${source.page_labels[0]}`}
          target="_blank"
          className="underline"
        >
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
          <Square />
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
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="flex gap-x-2 ml-12 md:ml-0">
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
              {!isCopied && <Copy />}
              {isCopied && <CopyCheck />}
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
            <RefreshCw />
            <span className="sr-only">Regenerate answer</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Regenerate</TooltipContent>
      </Tooltip>
      {/* thumbs up */}
      <Button type="button" size="icon" variant="ghost">
        <ThumbsUp />
        <span className="sr-only">Good answer</span>
      </Button>
      {/* thumbs down */}
      <Button type="button" size="icon" variant="ghost">
        <ThumbsDown />
        <span className="sr-only">Bad answer</span>
      </Button>
    </div>
  );

  function handleCopyClick(): void {
    if (messageContent) {
      // copy the full message (children) to the clipboard
      navigator.clipboard.writeText(messageContent);
      setIsCopied(true);
    }
  }
}