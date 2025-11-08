import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils"; // Import the new utility

// ✅ Generate the Brand Book API route
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { brandId } = await req.json();

    // ✅ Fetch the brand and include related data
    const existingBrand = await prisma.brand.findUnique({
      where: {
        id: brandId,
        userId: session.user.id,
      },
    });

    // ✅ Handle case where brand isn’t found or user doesn’t own it
    if (!existingBrand) {
      return new NextResponse("Brand not found or unauthorized", { status: 404 });
    }

    const prompt = `Generate a brand book for ${existingBrand.name} with mission, vision, values, and personality traits.`;

    const output = await generateGeminiText(prompt);

    // ✅ Update the brand with the generated brand book content
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        brandBook: output,
      },
    });

    return NextResponse.json({ brandBook: output });
  } catch (error: any) {
    console.error("Error generating brand book:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
