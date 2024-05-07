import { Message } from "ai";

import { ParsedMessage, ParsedSource, Source } from "./types";

/**
 * Moves the sources from the message content to the annotations, for fomatting in the chat.
 *
 * @param messages - The array of messages to parse.
 * @returns An array of parsed messages.
 */
export function parseMessagesForChat(messages: Message[]): ParsedMessage[] {
  return messages.map((message) => {
    if (message.role === "user") {
      return { ...message, annotations: [] };
    }
    console.log(message);
    // assistant role
    const [sourcesString, content] = message.content.split("||||");
    let documents: Array<Source> = [];
    try {
      documents = JSON.parse(sourcesString);
    } catch (e) {
      console.error("Failed to parse sources string", e);
    }

    return {
      ...message,
      content: content?.trim() || "",
      annotations: parseSources(documents),
    };
  });
}

export function parseSources(sources: Array<Source>): Array<ParsedSource> {
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
