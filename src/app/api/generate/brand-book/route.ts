import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateBrandBook } from "@/lib/brandBookGenerator";

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
      include: {
        // Include all relevant brand data for context
        messagingMatrix: true,
        slogans: true,
        colorPalettes: true,
        logoIdeas: true,
        generatedLogoImage: true,
      },
    });

    // ✅ Handle case where brand isn’t found or user doesn’t own it
    if (!existingBrand) {
      return new NextResponse("Brand not found or unauthorized", {
        status: 404,
      });
    }

    // ✅ Generate the brand book
    const brandBook = await generateBrandBook(existingBrand);

    // ✅ Update the brand with the generated brand book content
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        brandBook,
      },
    });

    return NextResponse.json({ success: true, brandBook });
  } catch (error: any) {
    console.error("Error generating brand book:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
