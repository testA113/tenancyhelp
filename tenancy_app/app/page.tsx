"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { CornerDownLeft } from "lucide-react";
import { useSession } from "next-auth/react";

import { EmptyScreen } from "@/components/empty-screen";
import { ChatList } from "@/components/chat/chat-list";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ExampleQueries } from "@/components/example-queries";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { LoginModalStore } from "@/lib/store/login-modal-store";

export default function Home() {
  const loginModal = LoginModalStore();
  const session = useSession();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    isLoading,
    error,
    stop,
    reload,
  } = useChat({ sendExtraMessageFields: true });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { formRef, onKeyDown } = useEnterSubmit();
  const hasChatStarted = messages.length > 0;

  useEffect(() => {
    if (session.status === "unauthenticated") {
      loginModal.setOpen();
    }
    if (session.status === "authenticated" && loginModal.isOpen) {
      loginModal.setClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  return (
    <div>
      <div className="pb-32 md:pb-48 pt-20">
        {hasChatStarted ? (
          <ChatList
            messages={messages}
            isLoading={isLoading}
            error={error}
            reload={reload}
            stop={stop}
          />
        ) : (
          <div className="flex flex-col">
            <EmptyScreen />
            {!hasChatStarted && (
              <div className="md:hidden">
                <ExampleQueries setInput={setInput} inputRef={inputRef} />
              </div>
            )}
          </div>
        )}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          {!hasChatStarted && (
            <div className="hidden md:block">
              <ExampleQueries setInput={setInput} inputRef={inputRef} />
            </div>
          )}
          <div className="pr-4 pt-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:pt-4 border border-t-muted-foreground sm:border-muted-foreground">
            {error && (
              <div className="text-center text-red-500">{error.message}</div>
            )}
            <form onSubmit={handleSubmit} ref={formRef} id="chat">
              <div className="relative flex flex-col w-full pr-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:pr-12">
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="How can I help?"
                  // anything smaller than text base 16px is too small for iphone and causes zooming when the input is focused
                  className="text-base min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  name="message"
                  form="chat"
                  rows={1}
                  value={input}
                  onChange={handleInputChange}
                />
                <div className="absolute right-0 top-4 sm:right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        variant="default"
                        disabled={input === ""}
                      >
                        <CornerDownLeft />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="w-full text-xs text-muted-foreground text-center">
                <div>
                  *Tenancy Help can make mistakes, double check the advice
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
