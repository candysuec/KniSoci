import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { generateGeminiText } from "@/lib/geminiUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { brandId } = await req.json();

    if (!brandId) {
      return NextResponse.json(
        { error: "Brand ID is required." },
        { status: 400 }
      );
    }

    // Verify that the brand belongs to the logged-in user
    const existingBrand = await prisma.brand.findUnique({
      where: { id: brandId, userId: session.user.id },
      include: { 
        // Include all relevant brand data for context
        mission: true, vision: true, values: true, targetAudience: true, usp: true, personalityTraits: true,
        messagingMatrix: true, slogans: true, colorPalettes: true, logoIdeas: true, generatedLogoImage: true,
      }
    });

    if (!existingBrand) {
      return new NextResponse("Brand not found or unauthorized", { status: 404 });
    }

    // TODO: Construct a detailed prompt for Gemini based on all available brand data
    const prompt = `
      Generate 4-6 core content pillars for the following brand, incorporating all provided information.
      Each content pillar should include:
      - A clear title
      - A brief description of the pillar's focus
      - 3-5 example topics or angles that fall under this pillar
      - How this pillar connects to the brand's mission, vision, and values

      Brand Information: ${JSON.stringify(existingBrand, null, 2)}

      Return the response as a JSON array of objects, where each object represents a content pillar.
    `;

    const text = await generateGeminiText(prompt, "gemini-1.5-pro");

    const parsed = JSON.parse(text);

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        contentPillars: parsed,
      },
    });

    return NextResponse.json({ brandId, contentPillars: parsed });
  } catch (error: any) {
    console.error("❌ Error generating content pillars:", error);
    return NextResponse.json(
      { error: error.message || "Gemini content pillars generation failed." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}