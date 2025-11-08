import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { callGeminiApi } from "@/lib/geminiUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { brandId, answers } = await req.json(); // 'answers' will be the input from the discovery wizard

    // Verify that the brand belongs to the logged-in user
    const existingBrand = await prisma.brand.findUnique({
      where: { id: brandId, userId: session.user.id },
    });

    const prompt = `
      Based on the following brand discovery answers, generate a comprehensive brand DNA:
      ${JSON.stringify(answers, null, 2)}

      Include: mission, vision, 3-4 core values, target audience description, unique selling proposition, and brand personality traits.
      Return the response as a JSON object with keys: mission, vision, values (array of strings), targetAudience, usp, personalityTraits (array of strings).
    `;

    const text = await callGeminiApi({
      modelName: "gemini-2.5-flash",
      prompt: prompt,
    });

    const parsed = JSON.parse(text);

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        mission: parsed.mission,
        vision: parsed.vision,
        values: parsed.values,
        targetAudience: parsed.targetAudience,
        usp: parsed.usp,
        personalityTraits: parsed.personalityTraits,
      },
    });

    return NextResponse.json({ brandId, brandDNA: parsed });
  } catch (error: any) {
    console.error("❌ Error generating brand discovery:", error);
    return NextResponse.json(
      { error: error.message || "Gemini brand discovery generation failed." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
