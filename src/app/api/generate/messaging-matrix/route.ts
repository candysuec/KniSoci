import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateMessagingMatrixPrompt = (brand: { name: string, mission?: string | null, vision?: string | null, values?: any, targetAudience?: string | null, usp?: string | null, personalityTraits?: any }) => {
  const brandDNA = {
    name: brand.name,
    mission: brand.mission,
    vision: brand.vision,
    values: brand.values,
    targetAudience: brand.targetAudience,
    usp: brand.usp,
    personalityTraits: brand.personalityTraits,
  };

  return `
    Based on the following Brand DNA, generate a comprehensive messaging matrix.
    Brand DNA: ${JSON.stringify(brandDNA, null, 2)}

    Your output MUST be a single, valid JSON object. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    The JSON object should have the following structure and keys:
    {
      "masterTagline": "A memorable, concise tagline for the brand.",
      "elevatorPitch": {
        "p15s": "A 15-second version of the elevator pitch.",
        "p30s": "A 30-second version of the elevator pitch.",
        "p60s": "A 60-second version of the elevator pitch."
      },
      "boilerplate": "A standard, reusable 'about us' paragraph.",
      "benefitStack": [
        { "title": "Benefit 1 Title", "description": "Description of the first key benefit." },
        { "title": "Benefit 2 Title", "description": "Description of the second key benefit." },
        { "title": "Benefit 3 Title", "description": "Description of the third key benefit." }
      ],
      "narrativeThemes": [
        "A list of 3-5 overarching story angles or message pillars."
      ],
      "sayDontSay": {
        "say": ["A list of words/phrases to use."],
        "dontSay": ["A list of words/phrases to avoid."]
      }
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
    if (!brand.mission) {
        return new NextResponse("Brand DNA must be generated before creating a messaging matrix.", { status: 400 });
    }

    const prompt = generateMessagingMatrixPrompt(brand);
    const rawOutput = await generateGeminiText(prompt, "gemini-1.5-flash");

    let messagingMatrix;
    try {
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      messagingMatrix = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response for Messaging Matrix:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        messagingMatrix: messagingMatrix,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[MESSAGING_MATRIX_POST]", error);
    return NextResponse.json(
      { error: error.message || "Messaging matrix generation failed." },
      { status: 500 }
    );
  }
}
