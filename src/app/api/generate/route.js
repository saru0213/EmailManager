import { generateEmailTemplates } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, senderEmail } = await req.json();

    if (!prompt || !senderEmail) {
      return NextResponse.json(
        { error: "Prompt and senderEmail are required" },
        { status: 400 }
      );
    }

    const templates = await generateEmailTemplates(prompt, senderEmail);

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Failed to generate templates" },
      { status: 500 }
    );
  }
}
