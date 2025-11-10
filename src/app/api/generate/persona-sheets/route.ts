import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generatePersonaSheetsPrompt = (brand: { name: string, description?: string | null, targetAudience?: string | null, personalityTraits?: any, values?: any }) => {
  const brandInfo = {
    name: brand.name,
    description: brand.description,
    targetAudience: brand.targetAudience,
    personalityTraits: brand.personalityTraits,
    values: brand.values,
  };

  return `
    As a professional marketing strategist, create 2-3 detailed Buyer Persona Sheets in Markdown format for the following brand.
    Each persona should be well-structured with clear headings and bullet points.
    Leverage all provided brand information, especially the target audience, personality traits, and values.

    For each persona, include sections for:
    - Persona Name (e.g., "Marketing Manager Mark")
    - Demographics (Age, Location, Income, Education, Occupation)
    - Psychographics (Goals, Challenges, Pain Points, Motivations, Hobbies)
    - Brand Interaction (How they discover the brand, what they expect, preferred communication channels)
    - Quotes (Example quotes they might say)
    - Bio (A short paragraph summarizing the persona)

    Brand Information: ${JSON.stringify(brandInfo, null, 2)}

    Your output MUST be a single, well-formatted Markdown string containing all persona sheets. Do not include any text or explanation before or after the Markdown content.
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
      return new NextResponse("Brand DNA must be generated before creating Persona Sheets.", { status: 400 });
    }

    const prompt = generatePersonaSheetsPrompt(brand);
    const personaSheetsContent = await generateGeminiText(prompt, "gemini-1.5-flash");

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: { personaSheets: personaSheetsContent },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[PERSONA_SHEETS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
