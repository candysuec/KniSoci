import { NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/geminiUtils";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const output = await generateGeminiText(prompt);
  return NextResponse.json({ result: output });
}
