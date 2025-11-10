import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateSalesDeckPrompt = (brand: { name: string, description?: string | null, mission?: string | null, vision?: string | null, values?: any, targetAudience?: string | null, usp?: string | null, personalityTraits?: any, messagingMatrix?: any, logoIdeas?: any, colorPalettes?: any, typographyPairings?: any, imageryAndArtDirection?: any }) => {
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
    logoIdeas: brand.logoIdeas,
    colorPalettes: brand.colorPalettes,
    typographyPairings: brand.typographyPairings,
    imageryAndArtDirection: brand.imageryAndArtDirection,
  };

  return `
    As a professional sales strategist, create a comprehensive Sales Deck outline in Markdown format for the following brand.
    The Sales Deck outline should be well-structured with clear headings, subheadings, and bullet points, suitable for a presentation.
    Leverage all provided brand information, including DNA, messaging, visual identity elements, and target audience.

    Include sections for:
    - **Introduction:** Hook, problem statement.
    - **About Us:** Brand story, mission, vision.
    - **The Problem:** Detailed explanation of the customer's pain points.
    - **Our Solution:** How the brand's product/service solves the problem, highlighting USP.
    - **Key Features/Benefits:** Detailed breakdown of offerings and their advantages.
    - **Target Audience:** Who benefits most.
    - **Case Studies/Testimonials:** (Suggest placeholders).
    - **Call to Action:** Clear next steps.
    - **Contact Information:** (Suggest placeholders).

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
      return new NextResponse("Brand DNA and Messaging Matrix must be generated before creating a Sales Deck.", { status: 400 });
    }

    const prompt = generateSalesDeckPrompt(brand);
    const salesDeckContent = await generateGeminiText(prompt, "gemini-1.5-flash");

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: { salesDeck: salesDeckContent },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[SALES_DECK_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
