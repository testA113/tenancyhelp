import { Message } from "ai";

export type Source = {
  id: string;
  title: string;
  doc_url: string;
  page_label: string;
};

export type ParsedSource = {
  id: string;
  title: string;
  doc_url: string;
  page_labels: string[];
};

export type ParsedMessage = {
  sources?: Array<ParsedSource>;
} & Message;
