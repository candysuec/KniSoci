import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { Client } from "@notionhq/client";
import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Helper to convert brand data to Notion block format
const brandToNotionBlocks = (brand: any) => {
  const blocks: BlockObjectRequest[] = [];

  blocks.push({
    object: "block",
    type: "heading_1",
    heading_1: {
      rich_text: [{ type: "text", text: { content: brand.name } }],
    },
  });

  if (brand.description) {
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: brand.description } }],
      },
    });
  }

  // Add Brand DNA
  if (brand.mission || brand.vision || brand.values) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Brand DNA" } }] },
    });
    if (brand.mission) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Mission:** ${brand.mission}` } }] } });
    if (brand.vision) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Vision:** ${brand.vision}` } }] } });
    if (brand.values && brand.values.length > 0) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Values:** ${brand.values.join(", ")}` } }] } });
  }

  // Add Messaging Matrix
  if (brand.messagingMatrix) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Messaging Matrix" } }] },
    });
    const matrix = brand.messagingMatrix;
    if (matrix.masterTagline) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Master Tagline:** ${matrix.masterTagline}` } }] } });
    if (matrix.boilerplate) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Boilerplate:** ${matrix.boilerplate}` } }] } });
  }

  // Add Logo Ideas
  if (brand.logoIdeas && brand.logoIdeas.length > 0) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Logo Ideas" } }] },
    });
    brand.logoIdeas.forEach((idea: any) => {
      blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**${idea.type}:** ${idea.description} (Keywords: ${idea.keywords})` } }] } });
    });
  }

  // Add Color Palettes
  if (brand.colorPalettes && brand.colorPalettes.length > 0) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Color Palettes" } }] },
    });
    brand.colorPalettes.forEach((palette: any) => {
      blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**${palette.name}:** ${palette.hexCodes.join(", ")} - ${palette.description}` } }] } });
    });
  }

  // Add Typography Pairings
  if (brand.typographyPairings && brand.typographyPairings.length > 0) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Typography Pairings" } }] },
    });
    brand.typographyPairings.forEach((pairing: any) => {
      blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Heading:** ${pairing.headingFont}, **Body:** ${pairing.bodyFont} - ${pairing.description}` } }] } });
    });
  }

  // Add Imagery & Art Direction
  if (brand.imageryAndArtDirection) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Imagery & Art Direction" } }] },
    });
    const iad = brand.imageryAndArtDirection;
    if (iad.moodBoardDescription) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Mood Board:** ${iad.moodBoardDescription}` } }] } });
    if (iad.photographyStyle) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Photography Style:** ${iad.photographyStyle}` } }] } });
    if (iad.photographyPrompts && iad.photographyPrompts.length > 0) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Photography Prompts:** ${iad.photographyPrompts.join("; ")}` } }] } });
    if (iad.illustrationStyle) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Illustration Style:** ${iad.illustrationStyle}` } }] } });
    if (iad.illustrationPrompts && iad.illustrationPrompts.length > 0) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `**Illustration Prompts:** ${iad.illustrationPrompts.join("; ")}` } }] } });
  }

  // Add Brand Book (as a code block for Markdown)
  if (brand.brandBook) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Brand Book (Markdown)" } }] },
    });
    blocks.push({
      object: "block",
      type: "code",
      code: {
        rich_text: [{ type: "text", text: { content: brand.brandBook } }],
        language: "markdown",
      },
    });
  }

  // Add Messaging Guide (as a code block for Markdown)
  if (brand.messagingGuide) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Messaging Guide (Markdown)" } }] },
    });
    blocks.push({
      object: "block",
      type: "code",
      code: {
        rich_text: [{ type: "text", text: { content: brand.messagingGuide } }],
        language: "markdown",
      },
    });
  }

  // Add Persona Sheets (as a code block for Markdown)
  if (brand.personaSheets) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Persona Sheets (Markdown)" } }] },
    });
    blocks.push({
      object: "block",
      type: "code",
      code: {
        rich_text: [{ type: "text", text: { content: brand.personaSheets } }],
        language: "markdown",
      },
    });
  }

  // Add Press Kit (as a code block for Markdown)
  if (brand.pressKit) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Press Kit (Markdown)" } }] },
    });
    blocks.push({
      object: "block",
      type: "code",
      code: {
        rich_text: [{ type: "text", text: { content: brand.pressKit } }],
        language: "markdown",
      },
    });
  }

  // Add Sales Deck (as a code block for Markdown)
  if (brand.salesDeck) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Sales Deck (Markdown)" } }] },
    });
    blocks.push({
      object: "block",
      type: "code",
      code: {
        rich_text: [{ type: "text", text: { content: brand.salesDeck } }],
        language: "markdown",
      },
    });
  }

  // Add Website Copy (as a code block for Markdown)
  if (brand.websiteCopy) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ type: "text", text: { content: "Website Copy (Markdown)" } }] },
    });
    blocks.push({
      object: "block",
      type: "code",
      code: {
        rich_text: [{ type: "text", text: { content: brand.websiteCopy } }],
        language: "markdown",
      },
    });
  }


  return blocks;
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

    if (!process.env.NOTION_TOKEN || !process.env.NOTION_PARENT_PAGE_ID) {
      return new NextResponse("Notion API token or parent page ID is not configured.", { status: 500 });
    }

    const brand = await prisma.brand.findFirst({
      where: { id: brandId, userId: session.user.id },
    });

    if (!brand) {
      return new NextResponse("Brand not found or unauthorized", { status: 404 });
    }
    if (!brand.mission) { // Brand DNA is a prerequisite
      return new NextResponse("Brand DNA must be generated before exporting to Notion.", { status: 400 });
    }

    const blocks = brandToNotionBlocks(brand);

    const response = await notion.pages.create({
      parent: { page_id: process.env.NOTION_PARENT_PAGE_ID },
      properties: {
        title: {
          title: [
            {
              type: "text",
              text: {
                content: `${brand.name} Brand Hub Export`,
              },
            },
          ],
        },
      },
      children: blocks,
    });

    const notionPageId = response.id;

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: { notionPageId: notionPageId },
    });

    return NextResponse.json(updatedBrand);
  } catch (error: any) {
    console.error("[NOTION_EXPORT_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}