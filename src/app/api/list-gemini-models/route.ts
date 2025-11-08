import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const { models } = await (genAI as any).listModels(); // Temporary workaround to bypass TypeScript error
    return NextResponse.json({ models });
  } catch (error: any) {
    console.error("Error listing Gemini models:", error);
    return NextResponse.json(
      { error: "Failed to list Gemini models", details: error.message },
      { status: 500 }
    );
  }
}
