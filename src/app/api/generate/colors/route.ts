import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generateColorPalettesPrompt = (brand: { name: string, description?: string | null, personalityTraits?: any, usp?: string | null }) => {
  const brandInfo = {
    name: brand.name,
    description: brand.description,
    personalityTraits: brand.personalityTraits,
    usp: brand.usp,
  };

  return `
    As a professional brand designer, generate 3 distinct color palettes for the following brand.
    Each palette should consist of 3-5 hex codes and include a name (e.g., "Primary", "Accent", "Neutral") and a brief description of its mood or purpose.

    Brand Info: ${JSON.stringify(brandInfo, null, 2)}

    Your output MUST be a single, valid JSON array of objects. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    Each object in the array should represent a color palette and have the following structure:
    {
      "name": "Name of the palette (e.g., 'Primary', 'Accent', 'Neutral').",
      "hexCodes": ["#RRGGBB", "#RRGGBB", "#RRGGBB"],
      "description": "A brief description of the palette's mood or intended use."
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
      return new NextResponse("Brand DNA must be generated before creating color palettes.", { status: 400 });
    }

    const prompt = generateColorPalettesPrompt(brand);
    const rawOutput = await generateGeminiText(prompt, "gemini-1.5-flash");

    let colorPalettes;
    try {
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      colorPalettes = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response for Color Palettes:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        colorPalettes: colorPalettes,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[COLOR_PALETTES_POST]", error);
    return NextResponse.json(
      { error: error.message || "Color palettes generation failed." },
      { status: 500 }
    );
  }
}
