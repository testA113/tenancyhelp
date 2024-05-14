import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/utils/connect-db";
import {
  ChatHistory,
  ChatHistoryBody,
  chatHistoryModel,
} from "@/models/chat-history-training";

export const POST = async (request: NextRequest) => {
  const data: ChatHistory = await request.json();

  try {
    await connectDB();
    await chatHistoryModel.create<ChatHistoryBody>({
      ...data,
      created: new Date(),
    });
    return NextResponse.json(
      { message: "Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
};
