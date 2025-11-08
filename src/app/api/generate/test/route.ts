import { NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/geminiUtils";

export async function GET() {
  try {
    const prompt = "Write a short test message for Gemini API connection.";
    const text = await generateGeminiText(prompt, "gemini-2.5-flash");
    return NextResponse.json({ success: true, message: "Gemini API test successful", response: text });
  } catch (error: any) {
    console.error("❌ Gemini test route error:", error);
    return NextResponse.json(
      { success: false, error: error.message, suggestion: "Ensure GOOGLE_GENERATIVE_AI_API_KEY is valid and the model name exists (try 'gemini-2.5-flash')." },
      { status: 500 }
    );
  }
}
