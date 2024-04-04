"use client";

import { Message, useChat } from "ai/react";
import { Document } from "./types";
import { EmptyScreen } from "./components/empty-screen";
import { useRef } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  const parsedMessages = parseMessages(messages);

  return (
    <div className="flex flex-col w-full max-w-2xl py-16 mx-auto stretch">
      {messages.length > 0 ? (
        parsedMessages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role}
            {message.content}
            <br />
            {message.documents &&
              message.documents.map((document) => (
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
        ))
      ) : (
        <EmptyScreen setInput={setInput} inputRef={inputRef} />
      )}

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
  );
}

type ParsedMessage = {
  id: string;
  role: string;
  content: string;
  documents?: Document[];
};

function parseMessages(messages: Message[]): ParsedMessage[] {
  return messages.map((message) => {
    if (message.role === "user") {
      return { id: message.id, role: "User: ", content: message.content };
    } else {
      const [documentsString, content] = message.content.split("||||");
      const documents = JSON.parse(documentsString) as Array<Document>;
      return { id: message.id, role: "Assistant: ", content, documents };
    }
  });
}
