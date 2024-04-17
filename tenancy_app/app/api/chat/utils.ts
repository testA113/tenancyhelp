import { ChatCompletionMessageParam } from "openai/resources";

/**
 * Moves the sources from the message content to the annotations, for fomatting in the chat.
 *
 * @param messages - The array of messages to parse.
 * @returns An array of parsed messages.
 */
export function parseMessagesForRequest(
  messages: ChatCompletionMessageParam[]
): ChatCompletionMessageParam[] {
  return messages.map((message) => {
    if (
      !message.content ||
      message.role === "user" ||
      !message.content.includes("||||")
    ) {
      return message;
    }
    // assistant role
    const [_, content] = message.content.split("||||");
    return {
      ...message,
      content: content.trim(),
    };
  });
}
