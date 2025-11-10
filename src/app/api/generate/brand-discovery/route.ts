import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateBrandDiscoveryPrompt = (brandName: string, brandDescription: string | null) => {
  return `
    As a world-class brand strategist, analyze the following brand and generate its core Brand DNA.
    Brand Name: "${brandName}"
    Description: "${brandDescription || 'No description provided.'}"

    Your output MUST be a single, valid JSON object. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    The JSON object should have the following structure and keys:
    {
      "mission": "A concise, powerful mission statement (1-2 sentences).",
      "vision": "An aspirational vision statement for the future (1-2 sentences).",
      "values": [
        "A list of 3-5 core brand values (e.g., 'Innovation', 'Integrity', 'Customer-Centricity')."
      ],
      "targetAudience": "A brief description of the primary target audience.",
      "usp": "A clear and compelling Unique Selling Proposition.",
      "personalityTraits": [
        "A list of 3-5 brand personality traits (e.g., 'Confident', 'Playful', 'Authoritative')."
      ]
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
      where: {
        id: brandId,
        userId: session.user.id,
      },
    });

    if (!brand) {
      return new NextResponse("Brand not found or you do not have permission", { status: 404 });
    }

    const prompt = generateBrandDiscoveryPrompt(brand.name, brand.description);
    const rawOutput = await generateGeminiText(prompt);

    let brandDna;
    try {
      // The AI might return the JSON string wrapped in markdown ```json ... ```
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      brandDna = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    const updatedBrand = await prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        mission: brandDna.mission,
        vision: brandDna.vision,
        values: brandDna.values,
        targetAudience: brandDna.targetAudience,
        usp: brandDna.usp,
        personalityTraits: brandDna.personalityTraits,
      },
    });

    return NextResponse.json(updatedBrand);

  } catch (error) {
    console.error("[BRAND_DISCOVERY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
