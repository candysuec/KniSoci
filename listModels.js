import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function listModels() {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY environment variable not set.');
    return;
  }

  const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    const response = await genAI.models.list();
    console.log("Raw API response:", response); // Debugging line

    for (const model of response.pageInternal) {
      console.log(`Model Name: ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Description: ${model.description}`);
      console.log(`  Input Token Limit: ${model.inputTokenLimit}`);
      console.log(`  Output Token Limit: ${model.outputTokenLimit}`);
      console.log(`  Supported Actions: ${model.supportedActions?.join(', ') || 'N/A'}`);
      console.log('---\n');
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
