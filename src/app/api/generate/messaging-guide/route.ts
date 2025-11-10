import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateMessagingGuidePrompt = (brand: { name: string, mission?: string | null, vision?: string | null, values?: any, targetAudience?: string | null, usp?: string | null, personalityTraits?: any, messagingMatrix?: any }) => {
  const brandInfo = {
    name: brand.name,
    mission: brand.mission,
    vision: brand.vision,
    values: brand.values,
    targetAudience: brand.targetAudience,
    usp: brand.usp,
    personalityTraits: brand.personalityTraits,
    messagingMatrix: brand.messagingMatrix,
  };

  return `
    As a professional brand strategist, create a comprehensive Messaging Guide in Markdown format for the following brand.
    The Messaging Guide should be well-structured with clear headings, subheadings, and bullet points.
    Leverage all provided brand information, especially the Messaging Matrix.

    Include sections for:
    - Master Tagline
    - Elevator Pitches (15s, 30s, 60s)
    - Boilerplate Description
    - Key Benefits & Value Proposition
    - Narrative Themes & Storytelling
    - Brand Voice & Tone (based on personality traits)
    - Say/Don't Say Guidelines

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
    if (!brand.mission || !brand.messagingMatrix) { // Prerequisites
      return new NextResponse("Brand DNA and Messaging Matrix must be generated before creating a Messaging Guide.", { status: 400 });
    }

    const prompt = generateMessagingGuidePrompt(brand);
    const messagingGuideContent = await generateGeminiText(prompt, "gemini-1.5-flash");

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: { messagingGuide: messagingGuideContent },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[MESSAGING_GUIDE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
