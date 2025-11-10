import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { generateGeminiText } from "@/lib/geminiUtils";

const generatePostIdeasPrompt = (brand: { name: string, targetAudience?: string | null, contentPillars?: any }) => {
  const brandInfo = {
    name: brand.name,
    targetAudience: brand.targetAudience,
    contentPillars: brand.contentPillars,
  };

  return `
    As a creative social media strategist, generate 10 diverse and engaging social media post ideas for the following brand, based on its content pillars.

    Brand Info: ${JSON.stringify(brandInfo, null, 2)}

    Your output MUST be a single, valid JSON array of objects. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    Each object in the array should represent a single post idea and have the following structure:
    {
      "pillar": "The title of the content pillar this post relates to.",
      "format": "The suggested format for the post (e.g., 'Instagram Carousel', 'TikTok Video', 'LinkedIn Article', 'Twitter Thread').",
      "hook": "A compelling, attention-grabbing first line or question for the post.",
      "body": "A brief 2-3 sentence description of the post's content or narrative.",
      "cta": "A clear and simple Call to Action for the post (e.g., 'Link in bio!', 'What are your thoughts?', 'Share your story.')."
    }
  `;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { brandId } = await req.json();
    if (!brandId) {
      return new NextResponse("Brand ID is required", { status: 400 });
    }

    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
    });

    if (!brand) {
      return new NextResponse("Brand not found or unauthorized", { status: 404 });
    }
    if (!brand.contentPillars) {
      return new NextResponse("Content Pillars must be generated before creating post ideas.", { status: 400 });
    }

    const prompt = generatePostIdeasPrompt(brand);
    const rawOutput = await generateGeminiText(prompt, "gemini-1.5-flash");

    let postIdeas;
    try {
      const jsonString = rawOutput.replace(/```json\n|```/g, "").trim();
      postIdeas = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response for Post Ideas:", e);
      console.error("Raw AI Output:", rawOutput);
      return new NextResponse("Failed to process AI response. The output was not valid JSON.", { status: 500 });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: {
        postIdeas: postIdeas,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[POST_IDEAS_POST]", error);
    return NextResponse.json(
      { error: error.message || "Post ideas generation failed." },
      { status: 500 }
    );
  }
}

