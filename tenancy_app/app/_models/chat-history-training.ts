import { Schema, model } from "mongoose";

export type ChatHistoryEventType = "copy" | "like" | "retry" | "dislike";

/**
 * Interface for individual messages in the chat history.
 */
export interface HistoryMessage {
  role: string;
  content: string;
}

/**
 * Interface for the chat history.
 */
export interface ChatHistory {
  messages: HistoryMessage[];
  created: Date;
  eventType: ChatHistoryEventType;
}

/**
 * Interface for the chat history body, which extends the ChatHistory interface with a created Date.
 */
export interface ChatHistoryBody extends ChatHistory {
  created: Date;
}

const messageSchema = new Schema<HistoryMessage>({
  role: { type: String },
  content: { type: String },
});

const chatHistorySchema = new Schema<ChatHistoryBody>({
  messages: [messageSchema],
  created: {
    type: Date,
    default: Date.now,
  },
  eventType: { type: String },
});

/**
 * Mongoose model for the chat history.
 */
export const chatHistoryModel = model("ChatHistoryTraining", chatHistorySchema);
