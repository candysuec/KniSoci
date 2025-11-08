// src/lib/selfrepair.ts
import { generateGeminiText } from "@/lib/geminiUtils";

export type SelfRepairInput = {
  repair?: boolean;
  context?: Record<string, unknown>;
};

export type SelfRepairOutput = {
  timestamp: string;
  mode: "development" | "production" | string;
  overall: string; // e.g., "✅ All systems nominal"
  checks: {
    codebase: {
      message: string;
      deprecatedReferences?: number;
      matches?: Array<{ file: string; line: number; snippet: string }>;
    };
    environment: {
      file?: string;
      message: string;
      fixes?: string[];
    };
    sdk: {
      version?: string;
      message: string;
      response?: string;
    };
  };
};

/**
 * runSelfRepair orchestrates a prompt to Gemini and maps its output into
 * the structured shape expected by the SelfRepair dashboard UI.
 */
export async function runSelfRepair(input: SelfRepairInput = {}): Promise<SelfRepairOutput> {
  const now = new Date().toISOString();

  // Build a resilient prompt; include flags and optional context to let Gemini reason.
  const prompt = [
    "You are a self-repair assistant for a Next.js + Prisma + NextAuth app.",
    "Analyze the app’s state and produce a compact JSON summary with the following shape:",
    `{
      "timestamp": "<ISO timestamp>",
      "mode": "development|production",
      "overall": "✅|⚠️|❌ + short message",
      "checks": {
        "codebase": {
          "message": "short status",
          "deprecatedReferences": <number>,
          "matches": [{"file":"...","line":123,"snippet":"..."}]
        },
        "environment": {
          "file": ".env.local",
          "message": "short status",
          "fixes": ["..."]
        },
        "sdk": {
          "version": "x.y.z",
          "message": "short status",
          "response": "short preview"
        }
      }
    }`,
    "",
    "Constraints:",
    "- Keep messages short and actionable.",
    "- If you are unsure of a field, still return the key with a safe default.",
    "- Do not include markdown; return only JSON.",
    "",
    `Flags: repair=${Boolean(input.repair)}`,
    input.context ? `Context: ${JSON.stringify(input.context).slice(0, 4000)}` : "Context: none",
  ].join("\n");

  // Call your unified Gemini helper (handles SDK differences)
  const raw = await generateGeminiText(prompt);

  // Try to parse JSON; if the model returns prose, fall back to safe defaults.
  let parsed: Partial<SelfRepairOutput> | null = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }

  // Safe defaults that your UI already knows how to render
  const fallback: SelfRepairOutput = {
    timestamp: now,
    mode: process.env.NODE_ENV || "development",
    overall: "⚠️ Could not parse model output. Using defaults.",
    checks: {
      codebase: {
        message: "⚠️ Unable to analyze codebase details from model output.",
        deprecatedReferences: 0,
        matches: [],
      },
      environment: {
        file: ".env.local",
        message: "⚠️ Unable to verify environment variables from model output.",
        fixes: [],
      },
      sdk: {
        version: process.env.NEXT_PUBLIC_SDK_VERSION || "unknown",
        message: "⚠️ Could not verify SDK health.",
        response: raw?.slice(0, 300) || "No model text returned.",
      },
    },
  };

  // Merge parsed (if valid) over fallback
  const out: SelfRepairOutput = {
    ...fallback,
    ...(parsed ?? {}),
    timestamp: (parsed?.timestamp as string) || now,
    checks: {
      ...fallback.checks,
      ...(parsed?.checks ?? {}),
            codebase: {
              ...fallback.checks.codebase,
              ...(parsed?.checks?.codebase ?? {}),
              message: parsed?.checks?.codebase?.message ?? fallback.checks.codebase.message,
            },
            environment: {
              ...fallback.checks.environment,
              ...(parsed?.checks?.environment ?? {}),
              message: parsed?.checks?.environment?.message ?? fallback.checks.environment.message,
            },
            sdk: {
              ...fallback.checks.sdk,
              ...(parsed?.checks?.sdk ?? {}),
              message: parsed?.checks?.sdk?.message ?? fallback.checks.sdk.message,
            },
    },
  };

  // Ensure minimally required strings exist
  if (!out.overall) out.overall = "⚠️ No overall status provided.";

  return out;
}