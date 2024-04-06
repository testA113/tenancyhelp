import { Message } from "ai";
import { ParsedMessage, ParsedSource, Source } from "./types";

export function parseMessages(messages: Message[]): ParsedMessage[] {
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
