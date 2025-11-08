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

    const { brandId, textToAnalyze } = await req.json();

    if (!brandId || !textToAnalyze) {
      return NextResponse.json(
        { error: "Brand ID and text to analyze are required." },
        { status: 400 }
      );
    }

    // Verify that the brand belongs to the logged-in user
    const existingBrand = await prisma.brand.findUnique({
      where: { id: brandId, userId: session.user.id },
      include: { 
        // Include the tone guide for context
        toneGuide: true,
      }
    });

    if (!existingBrand) {
      return new NextResponse("Brand not found or unauthorized", { status: 404 });
    }

    if (!existingBrand.toneGuide) {
      return NextResponse.json(
        { error: "Tone guide not found for this brand. Please generate one first." },
        { status: 400 }
      );
    }

    // TODO: Construct a detailed prompt for Gemini to analyze consistency
    const prompt = `
      Analyze the following text for consistency with the provided brand tone guide.
      Provide a consistency score (0-100) and detailed feedback on areas of alignment and misalignment.

      Brand Tone Guide: ${existingBrand.toneGuide}

      Text to Analyze: ${textToAnalyze}

      Return the response as a JSON object with keys: score (number), feedback (string).
    `;

    const text = await callGeminiApi({
      modelName: "gemini-1.5-pro", // Using gemini-1.5-pro for detailed generation
      prompt: prompt,
    });

    const parsed = JSON.parse(text);

    // Save the consistency score to the database
    await prisma.consistencyScore.create({
      data: {
        brandId: brandId,
        score: parsed.score,
        feedback: parsed.feedback,
        analyzedContent: textToAnalyze,
      },
    });

    return NextResponse.json({ brandId, analysis: parsed });
  } catch (error: any) {
    console.error("❌ Error running consistency check:", error);
    return NextResponse.json(
      { error: error.message || "Gemini consistency check failed." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}