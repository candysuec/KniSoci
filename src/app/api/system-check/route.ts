import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const diagnostics: { [key: string]: any } = {};

  // 1. Environment Variable Checks
  diagnostics.envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    GOOGLE_GENERATIVE_AI_API_KEY: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    // Add other critical env vars here
  };
  diagnostics.envVars.allPresent = Object.values(diagnostics.envVars).every(Boolean);

  // 2. Gemini API Status
  try {
    const geminiTest = await generateGeminiText("ping", "gemini-1.5-flash");
    diagnostics.geminiApi = {
      status: "Operational",
      testResponse: geminiTest.substring(0, 50) + "...", // Truncate response
    };
  } catch (error: any) {
    diagnostics.geminiApi = {
      status: "Error",
      message: error.message,
    };
  }

  // 3. Database Connectivity
  try {
    await prisma.$queryRaw`SELECT 1`; // Simple query to check connection
    diagnostics.database = {
      status: "Connected",
    };
  } catch (error: any) {
    diagnostics.database = {
      status: "Error",
      message: error.message,
    };
  }

  // 4. Last Self-Repair Run Status
  try {
    const logFilePath = path.join(process.cwd(), 'logs', 'selfrepair-log.json');
    const logContent = await fs.readFile(logFilePath, 'utf-8');
    const logs = JSON.parse(logContent);
    if (logs.length > 0) {
      const lastLog = logs[logs.length - 1];
      diagnostics.selfRepairLog = {
        lastRun: lastLog.timestamp,
        overallStatus: lastLog.overall,
        // Add more details if needed
      };
    } else {
      diagnostics.selfRepairLog = { status: "No logs found" };
    }
  } catch (error: any) {
    diagnostics.selfRepairLog = {
      status: "Error reading log",
      message: error.message,
    };
  }

  // Overall Status
  diagnostics.overallStatus =
    diagnostics.envVars.allPresent &&
    diagnostics.geminiApi.status === "Operational" &&
    diagnostics.database.status === "Connected" &&
    diagnostics.selfRepairLog.overallStatus === "✅ All systems nominal"
      ? "Operational"
      : "Degraded";

  return NextResponse.json(diagnostics);
}
