import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateLogoIdeasPrompt = (brand: { name: string, description?: string | null, mission?: string | null, vision?: string | null, personalityTraits?: any, usp?: string | null }) => {
  const brandInfo = {
    name: brand.name,
    description: brand.description,
    mission: brand.mission,
    vision: brand.vision,
    personalityTraits: brand.personalityTraits,
    usp: brand.usp,
  };

  return `
    As a creative logo designer, generate 5 distinct logo ideas for the following brand.
    Each idea should be a unique concept, focusing on different styles (e.g., wordmark, symbol, abstract, emblem, mascot).
    Provide a clear description of the concept and relevant keywords for image generation.

    Brand Info: ${JSON.stringify(brandInfo, null, 2)}

    Your output MUST be a single, valid JSON array of objects. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    Each object in the array should represent a logo idea and have the following structure:
    {
      "type": "The style of the logo (e.g., 'Wordmark', 'Symbol', 'Abstract Mark', 'Emblem', 'Mascot').",
      "description": "A detailed description of the logo concept, its elements, and what it conveys about the brand.",
      "keywords": "3-5 comma-separated keywords suitable for an image generation AI (e.g., 'minimalist, blue, tech, modern')."
    }
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
      return new NextResponse("Brand DNA must be generated before creating logo ideas.", { status: 400 });
    }

    const prompt = generateLogoIdeasPrompt(brand);
    const rawOutput = await generateGeminiText(prompt, "gemini-1.5-flash");

    let logoIdeas;
    try {
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      logoIdeas = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response for Logo Ideas:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        logoIdeas: logoIdeas,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[LOGO_IDEAS_POST]", error);
    return NextResponse.json(
      { error: error.message || "Logo ideas generation failed." },
      { status: 500 }
    );
  }
}
