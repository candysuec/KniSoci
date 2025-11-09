import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/db"; // Prisma client
import { v4 as uuidv4 } from "uuid";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""); // Use correct env var

/**
 * Runs Gemini-based self-repair diagnostics.
 * Logs results into Prisma SelfRepairLog table.
 */
export async function runSelfRepair(userId?: string) { // userId is now optional
  const repairId = uuidv4();

  const prompt = `
  You are the KniSoci self-repair AI system.
  Analyze the app environment for potential issues such as:
  - Database connectivity
  - Missing routes
  - API response errors
  - Schema mismatches
  Summarize potential issues and suggested fixes in clear text.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text(); // Use responseText

    // Use SelfRepairLog model as per schema
    const selfRepairLog = await prisma.selfRepairLog.create({
      data: {
        id: repairId,
        userId: userId || null, // userId is optional, use null if undefined
        mode: process.env.NODE_ENV || "development", // Add mode
        overall: responseText.toLowerCase().includes("error") ? "❌ Issues found" : "✅ All systems nominal", // Add overall
        details: { log: responseText }, // Store response in details
      },
    });

    return selfRepairLog;
  } catch (error: any) {
    console.error("❌ Self-repair process failed:", error);
    throw new Error("Self-repair process failed.");
  }
}