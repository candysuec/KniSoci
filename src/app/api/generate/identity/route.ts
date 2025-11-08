import { NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/geminiUtils";

export async function POST(req: Request) {
  try {
    const { brandDescription, brandId } = await req.json();

    console.log("Received body for identity generation:", { brandDescription, brandId });

    const prompt = `
      Given the following brand description, generate a mission statement,
      a vision statement, and a list of 3-4 core values.
      Return the response as a JSON object with the keys "mission", "vision", and "values".

      Description: "${brandDescription}"
    `;

    const text = await generateGeminiText(prompt, "gemini-1.5-pro");

    console.log("Raw Gemini response:", text);

    const parsed = JSON.parse(text);

    return NextResponse.json({
      brandId,
      identity: parsed,
    });
  } catch (error: any) {
    console.error("❌ Error generating brand identity:", error);
    return NextResponse.json(
      { error: error.message || "Gemini identity generation failed." },
      { status: 500 }
    );
  }
}
