import { GoogleGenerativeAI, GenerativeModel, GenerateContentResult } from "@google/generative-ai";

interface GeminiCallOptions {
  modelName?: string;
  prompt: string;
  safetySettings?: any[]; // Define more specific type if needed
  generationConfig?: any; // Define more specific type if needed
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function callGeminiApi(options: GeminiCallOptions): Promise<string> {
  const { modelName = "gemini-1.5-flash", prompt, safetySettings, generationConfig } = options;

  try {
    const model: GenerativeModel = genAI.getGenerativeModel({ model: modelName });

    const result: GenerateContentResult = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig,
    });

    const response = result.response;

    if (!response || !response.text) {
      throw new Error("Gemini API did not return a valid text response.");
    }

    return response.text();
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    // Enhance error message for better debugging
    if (error.message.includes("API_KEY_INVALID")) {
      throw new Error("Gemini API Key is invalid or not configured.");
    }
    if (error.message.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Gemini API rate limit exceeded or quota exhausted.");
    }
    throw new Error(`Failed to get response from Gemini API: ${error.message}`);
  }
}
