import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const usageRecords = await (prisma as any).usageRecord.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(usageRecords);
  } catch (error: any) {
    console.error("Error fetching usage records:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage records." },
      { status: 500 }
    );
  } finally {
    // No need to disconnect if using a singleton Prisma client
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { feature, count } = await req.json();

    if (!feature) {
      return NextResponse.json(
        { error: "Feature is required." },
        { status: 400 }
      );
    }

    const newUsageRecord = await (prisma as any).usageRecord.create({
      data: {
        userId: session.user.id,
        feature,
        count: count || 1,
      },
    });

    return NextResponse.json(newUsageRecord, { status: 201 });
  } catch (error: any) {
    console.error("Error creating usage record:", error);
    return NextResponse.json(
      { error: "Failed to create usage record." },
      { status: 500 }
    );
  } finally {
    // No need to disconnect if using a singleton Prisma client
  }
}