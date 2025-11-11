import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { reportedUrl, category, notes } = await req.json();

    if (!reportedUrl || !category) {
      return new NextResponse("Reported URL and category are required", { status: 400 });
    }

    const newReport = await prisma.report.create({
      data: {
        userId: session.user.id,
        reportedUrl,
        category,
        notes,
        status: "PENDING", // Default status
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("[API/SAFETY/REPORTS/POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
