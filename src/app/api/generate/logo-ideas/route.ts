import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { generateGeminiText } from "@/lib/geminiUtils";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient(); // Instantiate PrismaClient
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { input, brandId } = await req.json();

    if (!input || !brandId) {
      return NextResponse.json({ error: 'Input and brandId are required' }, { status: 400 });
    }

    // Verify that the brand belongs to the logged-in user
    const existingBrand = await prisma.brand.findUnique({
      where: { id: brandId, userId: session.user.id },
    });

    if (!existingBrand) {
      return new NextResponse('Brand not found or unauthorized', { status: 404 });
    }

    const truncatedInput = input.substring(0, 1000); // Truncate input to 1000 characters
    const prompt = `Generate 3-4 creative logo ideas (textual descriptions) for a brand described as: "${truncatedInput}". Focus on conveying the brand's essence and visual style. Return the response as a JSON array of strings.`;

    const text = await generateGeminiText(prompt, "gemini-1.5-flash");

    console.log("Raw Gemini logo ideas response text:", text);
    const result = JSON.parse(text);

    // Update the brand in the database
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        logoIdeas: result, // Store the array of logo ideas
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
