import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateBrandBookPrompt = (brand: { name: string, description?: string | null, mission?: string | null, vision?: string | null, values?: any, targetAudience?: string | null, usp?: string | null, personalityTraits?: any, messagingMatrix?: any, contentPillars?: any }) => {
  const brandInfo = {
    name: brand.name,
    description: brand.description,
    mission: brand.mission,
    vision: brand.vision,
    values: brand.values,
    targetAudience: brand.targetAudience,
    usp: brand.usp,
    personalityTraits: brand.personalityTraits,
    messagingMatrix: brand.messagingMatrix,
    contentPillars: brand.contentPillars,
  };

  return `
    As a professional brand strategist, create a comprehensive Brand Book in Markdown format for the following brand.
    The Brand Book should be well-structured with clear headings, subheadings, and bullet points.
    Include sections for:
    - Brand Overview (Name, Description, Mission, Vision)
    - Core Values
    - Target Audience
    - Unique Selling Proposition (USP)
    - Brand Personality
    - Messaging Guidelines (Master Tagline, Elevator Pitches, Boilerplate, Benefit Stack, Narrative Themes, Say/Don't Say)
    - Content Strategy (Content Pillars with example topics)
    - Suggested Next Steps/Applications

    Brand Information: ${JSON.stringify(brandInfo, null, 2)}

    Your output MUST be a single, well-formatted Markdown string. Do not include any text or explanation before or after the Markdown content.
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
    if (!brand.mission) { // Check for Brand DNA as a prerequisite
      return new NextResponse("Brand DNA must be generated before creating a Brand Book.", { status: 400 });
    }

    const prompt = generateBrandBookPrompt(brand);
    const brandBookContent = await generateGeminiText(prompt, "gemini-1.5-flash"); // Use flash model

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: { brandBook: brandBookContent },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[BRAND_BOOK_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
