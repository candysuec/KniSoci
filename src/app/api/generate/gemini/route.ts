import { callGeminiApi } from "@/lib/geminiUtils";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const output = await callGeminiApi({
    modelName: "gemini-1.5-flash",
    prompt: prompt,
  });
  return Response.json({ output: output });
}