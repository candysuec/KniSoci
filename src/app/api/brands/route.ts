import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // ✅ Using your standardized db.ts

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error loading brands:", error);
    return NextResponse.json({ error: "Failed to load brands" }, { status: 500 });
  }
}
