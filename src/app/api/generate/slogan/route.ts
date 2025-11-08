import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { generateGeminiText } from "@/lib/geminiUtils";

const prisma = new PrismaClient();

/**
 * POST handler to generate slogans for a given brand.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { input, brandId } = await req.json();

    if (!input || !brandId) {
      return NextResponse.json(
        { error: 'Input and brandId are required' },
        { status: 400 }
      );
    }

    // Verify that the brand belongs to the logged-in user
    const existingBrand = await prisma.brand.findUnique({
      where: { id: brandId, userId: session.user.id },
    });

    if (!existingBrand) {
      return new NextResponse('Brand not found or unauthorized', { status: 404 });
    }

    // Create a short prompt for Gemini
    const truncatedInput = input.slice(0, 200);
    const prompt = `Create 3 short, catchy brand slogans for: ${truncatedInput}`;

    const text = await generateGeminiText(prompt, "gemini-1.5-flash");

    console.log("Raw Gemini slogan response text:", text);
    const slogans = text.split('\n').filter(slogan => slogan.trim() !== '');

    // Save slogans in the database
    await prisma.brand.update({
      where: { id: brandId },
      data: { slogans },
    });

    return NextResponse.json({ slogans });
  } catch (error: any) {
    console.error("Slogan generation failed:", error);
    return NextResponse.json(
      { error: 'Failed to generate slogan' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
