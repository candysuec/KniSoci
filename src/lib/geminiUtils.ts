import { GoogleGenerativeAI, GenerativeModel, GenerateContentResult } from "@google/generative-ai";

/**
 * Unified Gemini model helper.
 * Handles both older and newer SDK formats safely.
 */
export async function generateGeminiText(
  prompt: string,
  modelName = "gemini-1.5-flash"
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing from environment variables.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  // ✅ Safely extract the response text across SDK versions
  try {
    if (result.response && typeof result.response.text === "function") {
      return await result.response.text();
    } else if (typeof result.response === "string") {
      return result.response;
    } else if (result.response && typeof result.response === "object" && "text" in result.response && typeof (result.response as any).text === "string") {
      // Fallback for older SDK versions where .text() might not be a function but a direct string
      return (result.response as any).text;
    }

    throw new Error("Could not extract text from Gemini API response.");
  } catch (error: any) {
    console.error("Error in generateGeminiText:", error);
    throw new Error(`Gemini API call failed: ${error.message}`);
  }
}