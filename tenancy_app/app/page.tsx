"use client";

import { Message, useChat } from "ai/react";
import { EmptyScreen } from "./components/empty-screen";
import { useRef } from "react";
import { ChatList } from "./components/chat-list";
import { ChatScrollAnchor } from "./lib/hooks/chat-scroll-anchor";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="pb-[200px] pt-4 md:pt-10">
        {messages.length > 0 ? (
          <ChatList messages={messages} />
        ) : (
          <EmptyScreen setInput={setInput} inputRef={inputRef} />
        )}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="fixed bottom-0 w-full max-w-2xl p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}
