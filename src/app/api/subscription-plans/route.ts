import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const plans = await (prisma as any).subscriptionPlan.findMany();
    return NextResponse.json(plans);
  } catch (error: any) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription plans." },
      { status: 500 }
    );
  } finally {
    // No need to disconnect if using a singleton Prisma client
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, price, currency, features, stripeProductId, stripePriceId } = await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required." },
        { status: 400 }
      );
    }

    const newPlan = await (prisma as any).subscriptionPlan.create({
      data: {
        name,
        description,
        price,
        currency,
        features,
        stripeProductId,
        stripePriceId,
      },
    });

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error: any) {
    console.error("Error creating subscription plan:", error);
    return NextResponse.json(
      { error: "Failed to create subscription plan." },
      { status: 500 }
    );
  } finally {
    // No need to disconnect if using a singleton Prisma client
  }
}