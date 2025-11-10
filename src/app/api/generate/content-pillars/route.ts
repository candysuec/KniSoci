import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateContentPillarsPrompt = (brand: { name: string, mission?: string | null, targetAudience?: string | null, values?: any }) => {
  const brandInfo = {
    name: brand.name,
    mission: brand.mission,
    targetAudience: brand.targetAudience,
    values: brand.values,
  };

  return `
    As a master content strategist, generate 4-5 core content pillars for the following brand based on its DNA.
    Brand DNA: ${JSON.stringify(brandInfo, null, 2)}

    Your output MUST be a single, valid JSON array of objects. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    Each object in the array should represent a content pillar and have the following structure:
    {
      "title": "The clear, concise title of the content pillar.",
      "description": "A brief 1-2 sentence description of what this pillar covers and why it's important for the audience.",
      "topics": [
        "A list of 3-5 specific example topics, questions, or content ideas that fall under this pillar."
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
      where: { id: brandId, userId: session.user.id },
    });

    if (!brand) {
      return new NextResponse("Brand not found or unauthorized", { status: 404 });
    }
    if (!brand.mission) {
      return new NextResponse("Brand DNA must be generated before creating content pillars.", { status: 400 });
    }

    const prompt = generateContentPillarsPrompt(brand);
    const rawOutput = await generateGeminiText(prompt, "gemini-1.5-flash");

    let contentPillars;
    try {
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      contentPillars = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response for Content Pillars:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        contentPillars: contentPillars,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[CONTENT_PILLARS_POST]", error);
    return NextResponse.json(
      { error: error.message || "Content pillars generation failed." },
      { status: 500 }
    );
  }
}