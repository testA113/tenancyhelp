import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/utils/connect-db";
import {
  ChatHistory,
  ChatHistoryBody,
  chatHistoryModel,
} from "@/models/chat-history-training";

import { authOptions } from "../auth/[...nextauth]/auth-config";

export const POST = async (request: NextRequest) => {
  const data: ChatHistory = await request.json();

  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "UnAuthorized" }, { status: 404 });
    }
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
