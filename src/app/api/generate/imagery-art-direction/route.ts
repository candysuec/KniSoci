import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateImageryArtDirectionPrompt = (brand: { name: string, description?: string | null, mission?: string | null, vision?: string | null, personalityTraits?: any, usp?: string | null, targetAudience?: string | null, colorPalettes?: any, typographyPairings?: any }) => {
  const brandInfo = {
    name: brand.name,
    description: brand.description,
    mission: brand.mission,
    vision: brand.vision,
    personalityTraits: brand.personalityTraits,
    usp: brand.usp,
    targetAudience: brand.targetAudience,
    colorPalettes: brand.colorPalettes,
    typographyPairings: brand.typographyPairings,
  };

  return `
    As a professional art director and brand strategist, generate detailed imagery and art direction guidelines for the following brand.
    Leverage all provided brand information, including DNA, color palettes, and typography pairings, to ensure visual consistency.

    Your output MUST be a single, valid JSON object. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    The JSON object should have the following structure:
    {
      "moodBoardDescription": "A detailed textual description of the overall mood board, including key visual themes, emotions, and aesthetic references.",
      "photographyStyle": "A concise description of the recommended photography style (e.g., 'Candid, natural light, warm tones', 'Bold, high-contrast, studio shots').",
      "photographyPrompts": [
        "Specific prompts for AI image generation or guidance for photographers (e.g., 'Close-up of diverse people laughing in a cafe, shallow depth of field').",
        "Another specific photography prompt."
      ],
      "illustrationStyle": "A concise description of the recommended illustration style (e.g., 'Minimalist line art, pastel colors', 'Vibrant, geometric, abstract shapes').",
      "illustrationPrompts": [
        "Specific prompts for AI illustration generation or guidance for illustrators (e.g., 'Abstract representation of growth, flowing lines, green and blue palette').",
        "Another specific illustration prompt."
      ]
    }

    Brand Information: ${JSON.stringify(brandInfo, null, 2)}
  `;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { brandId } = await req.json();
    if (!brandId) {
      return new NextResponse("Brand ID is required", { status: 400 });
    }

    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
    });

    if (!brand) {
      return new NextResponse("Brand not found or unauthorized", { status: 404 });
    }
    if (!brand.mission) { // Brand DNA is a prerequisite
      return new NextResponse("Brand DNA must be generated before creating Imagery & Art Direction.", { status: 400 });
    }

    const prompt = generateImageryArtDirectionPrompt(brand);
    const rawOutput = await generateGeminiText(prompt, "gemini-1.5-flash");

    let imageryAndArtDirection;
    try {
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      imageryAndArtDirection = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response for Imagery & Art Direction:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: { imageryAndArtDirection: imageryAndArtDirection },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[IMAGERY_ART_DIRECTION_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
