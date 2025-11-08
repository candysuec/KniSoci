import { generateGeminiText } from "@/lib/geminiUtils";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const output = await generateGeminiText(prompt, "gemini-1.5-flash");
  return Response.json({ output: output });
}