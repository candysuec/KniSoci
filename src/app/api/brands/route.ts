import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const brands = await prisma.brand.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error("[BRANDS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name, description } = await req.json();

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: {
        userId: session.user.id,
        name,
        description,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("[BRANDS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}