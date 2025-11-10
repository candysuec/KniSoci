import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateAdvancedConsistencyPrompt = (brand: { name: string, description?: string | null, mission?: string | null, vision?: string | null, values?: any, targetAudience?: string | null, usp?: string | null, personalityTraits?: any, messagingMatrix?: any, logoIdeas?: any, colorPalettes?: any, typographyPairings?: any, imageryAndArtDirection?: any }, contentToAnalyze: string) => {
  const brandIdentity = {
    name: brand.name,
    description: brand.description,
    mission: brand.mission,
    vision: brand.vision,
    values: brand.values,
    targetAudience: brand.targetAudience,
    usp: brand.usp,
    personalityTraits: brand.personalityTraits,
    messagingMatrix: brand.messagingMatrix,
    logoIdeas: brand.logoIdeas,
    colorPalettes: brand.colorPalettes,
    typographyPairings: brand.typographyPairings,
    imageryAndArtDirection: brand.imageryAndArtDirection,
  };

  return `
    As an expert brand strategist and AI, analyze the following content for its consistency with the provided comprehensive brand identity.
    Provide a holistic consistency score (0-100) and a detailed report. The report should highlight specific areas of strong alignment and misalignment, referencing elements from the brand identity. Consider tone of voice, messaging, visual cues (implied by text), and overall brand personality.

    Comprehensive Brand Identity: ${JSON.stringify(brandIdentity, null, 2)}

    Content to Analyze:
    ---
    "${contentToAnalyze}"
    ---

    Your output MUST be a single, valid JSON object. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    The JSON object should have the following structure:
    {
      "score": "A number from 0 to 100 representing the overall consistency.",
      "report": "A detailed, multi-paragraph report (Markdown formatted) explaining the score, highlighting specific strengths and weaknesses in consistency across different brand identity aspects (e.g., messaging, tone, implied visuals)."
    }
  `;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { brandId, contentToAnalyze } = await req.json();
    if (!brandId || !contentToAnalyze) {
      return new NextResponse("Brand ID and content to analyze are required.", { status: 400 });
    }

    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
    });

    if (!brand) {
      return new NextResponse("Brand not found or unauthorized", { status: 404 });
    }
    if (!brand.mission) { // Brand DNA is a prerequisite for comprehensive identity
      return new NextResponse("Brand DNA must be generated before performing advanced consistency checks.", { status: 400 });
    }

    const prompt = generateAdvancedConsistencyPrompt(brand, contentToAnalyze);
    const rawOutput = await generateGeminiText(prompt, "gemini-1.5-flash");

    let analysis;
    try {
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      analysis = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response for Advanced Consistency Score:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("[ADVANCED_CONSISTENCY_SCORE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}