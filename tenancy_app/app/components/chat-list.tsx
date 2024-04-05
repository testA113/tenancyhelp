import { Message } from "ai";

import { Source } from "../types";

type ParsedMessage = {
  id: string;
  role: string;
  content: string;
  documents?: Source[];
};

export function ChatList({ messages }: { messages: Array<Message> }) {
  const parsedMessages = parseMessages(messages);
  return (
    <>
      {parsedMessages.map((message) => (
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
      ))}
    </>
  );
}

function parseMessages(messages: Message[]): ParsedMessage[] {
  return messages.map((message) => {
    if (message.role === "user") {
      return { id: message.id, role: "User: ", content: message.content };
    } else {
      const [documentsString, content] = message.content.split("||||");
      const documents = JSON.parse(documentsString) as Array<Source>;
      return { id: message.id, role: "Assistant: ", content, documents };
    }
  });
}
