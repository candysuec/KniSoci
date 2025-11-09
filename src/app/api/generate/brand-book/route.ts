import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || "");

/**
 * Generates a Brand Book for a given Brand using Gemini
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null; // Get userId from session

    const { brandId } = await req.json();
    if (!brandId) return new NextResponse("Missing brandId", { status: 400 });

    const brand = await prisma.brand.findUnique({
      where: { id: brandId, userId: userId as string }, // Ensure brand belongs to user
    });

    if (!brand) return new NextResponse("Brand not found", { status: 404 });

    const prompt = `
    Create a complete Brand Book for the following brand:

    Name: ${brand.name}
    Mission: ${brand.mission || "N/A"}
    Vision: ${brand.vision || "N/A"}
    Values: ${JSON.stringify(brand.values || "N/A")}
    Target Audience: ${brand.targetAudience || "N/A"}
    USP: ${brand.usp || "N/A"}
    Personality Traits: ${JSON.stringify(brand.personalityTraits || "N/A")}
    Messaging Matrix: ${JSON.stringify(brand.messagingMatrix || "N/A")}
    Slogans: ${brand.slogans || "N/A"}

    Please structure the output with sections:
    - Brand Overview
    - Core Identity
    - Tone & Voice
    - Messaging Guidelines
    - Design Principles
    - Visual Identity
    - Suggested Next Steps
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const brandBookContent = await result.response.text();

    const updatedBrand = await prisma.brand.update({
      where: { id: brand.id },
      data: { brandBook: brandBookContent },
    });

    return NextResponse.json({
      message: "Brand Book generated successfully",
      brand: updatedBrand,
    });
  } catch (error: any) {
    console.error("❌ Brand book generation failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
