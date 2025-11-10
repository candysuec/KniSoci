import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generatePressKitPrompt = (brand: { name: string, description?: string | null, mission?: string | null, vision?: string | null, values?: any, targetAudience?: string | null, usp?: string | null, personalityTraits?: any, messagingMatrix?: any, logoIdeas?: any, colorPalettes?: any, typographyPairings?: any, imageryAndArtDirection?: any }) => {
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
    As a professional PR specialist, create a comprehensive Press Kit in Markdown format for the following brand.
    The Press Kit should be well-structured with clear headings, subheadings, and bullet points.
    Leverage all provided brand information, including DNA, messaging, visual identity elements, and target audience.

    Include sections for:
    - **Company Overview:** Mission, Vision, Description, Key Facts.
    - **Key Messaging:** Master Tagline, Boilerplate, Elevator Pitches.
    - **Brand Story:** Origin, values, unique selling proposition.
    - **Leadership/Founders:** Brief bios (if available, otherwise suggest placeholders).
    - **Visual Identity:** Logo usage guidelines (description of ideas), color palette, typography.
    - **Target Audience:** Description of ideal customers.
    - **Contact Information:** (Suggest placeholders).
    - **Call to Action:** (Suggest placeholders).

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
      return new NextResponse("Brand DNA and Messaging Matrix must be generated before creating a Press Kit.", { status: 400 });
    }

    const prompt = generatePressKitPrompt(brand);
    const pressKitContent = await generateGeminiText(prompt, "gemini-1.5-flash");

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: { pressKit: pressKitContent },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[PRESS_KIT_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
