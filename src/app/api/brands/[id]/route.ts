
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const brand = await prisma.brand.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!brand) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("[BRAND_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
