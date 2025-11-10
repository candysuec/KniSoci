import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateConsistencyPrompt = (brand: { personalityTraits?: any, values?: any }, textToAnalyze: string) => {
  const brandInfo = {
    personalityTraits: brand.personalityTraits,
    values: brand.values,
  };

  return `
    As a brand consistency expert, analyze the following text against the provided brand identity.
    The brand's identity is defined by these characteristics: ${JSON.stringify(brandInfo, null, 2)}

    The text to analyze is:
    ---
    "${textToAnalyze}"
    ---

    Your task is to provide a consistency score and a brief, constructive reasoning.
    Your output MUST be a single, valid JSON object. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    The JSON object should have the following structure and keys:
    {
      "score": "A number from 0 to 100 representing how well the text aligns with the brand identity.",
      "reasoning": "A brief, 2-3 sentence explanation for the score, highlighting specific words or phrases that align or misalign with the brand's personality and values."
    }
  `;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { brandId, textToAnalyze } = await req.json();
    if (!brandId || !textToAnalyze) {
      return new NextResponse("Brand ID and text to analyze are required.", { status: 400 });
    }

    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
    });

    if (!brand) {
      return new NextResponse("Brand not found or unauthorized", { status: 404 });
    }
    if (!brand.personalityTraits) {
      return new NextResponse("Brand DNA must be generated before checking consistency.", { status: 400 });
    }

    const prompt = generateConsistencyPrompt(brand, textToAnalyze);
    const rawOutput = await generateGeminiText(prompt, "gemini-1.5-flash");

    let analysis;
    try {
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      analysis = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response for Consistency Checker:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("[CONSISTENCY_CHECKER_POST]", error);
    return NextResponse.json(
      { error: error.message || "Consistency check failed." },
      { status: 500 }
    );
  }
}