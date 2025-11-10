import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateTypographyPrompt = (brand: { name: string, mission?: string | null, vision?: string | null, personalityTraits?: any, targetAudience?: string | null }) => {
  const brandInfo = {
    name: brand.name,
    mission: brand.mission,
    vision: brand.vision,
    personalityTraits: brand.personalityTraits,
    targetAudience: brand.targetAudience,
  };

  return `
    As a professional brand designer, generate 3 distinct typography pairings for the following brand.
    Each pairing should include a heading font, a body font, and a brief rationale for why they suit the brand's identity.
    Consider the brand's personality traits and target audience.

    Brand Info: ${JSON.stringify(brandInfo, null, 2)}

    Your output MUST be a single, valid JSON array of objects. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    Each object in the array should represent a typography pairing and have the following structure:
    {
      "headingFont": "Suggested font name for headings (e.g., 'Montserrat', 'Playfair Display').",
      "bodyFont": "Suggested font name for body text (e.g., 'Open Sans', 'Lato').",
      "description": "A brief rationale explaining why this pairing is suitable for the brand's identity."
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
      return new NextResponse("Brand DNA must be generated before creating typography pairings.", { status: 400 });
    }

    const prompt = generateTypographyPrompt(brand);
    const rawOutput = await generateGeminiText(prompt, "gemini-1.5-flash");

    let typographyPairings;
    try {
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      typographyPairings = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response for Typography Pairings:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        typographyPairings: typographyPairings,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[TYPOGRAPHY_MATCH_POST]", error);
    return NextResponse.json(
      { error: error.message || "Typography generation failed." },
      { status: 500 }
    );
  }
}