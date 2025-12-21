import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_SENDER_EMAIL = process.env.SENDER_EMAIL;
export async function generateEmailTemplates(prompt, senderEmail) {
  const emailToUse = senderEmail || DEFAULT_SENDER_EMAIL;

  if (!emailToUse) {
    throw new Error("Sender email is not defined in environment variables or parameter");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const result = await model.generateContent(`
Generate 3 professional email templates for business communication.

Requirements:
- Each template must include:
  - name: short descriptive template name
  - subject: short, compelling subject line
  - intro: greeting paragraph using {{name}}
  - mainBody: clear and concise main message
  - footer: polite closing with sender email ${senderEmail}
- Use {{name}} and {{email}} placeholders
- Sender email MUST be "${senderEmail}" and appear in the footer
- Tone: professional, polite, and actionable
- Keep mainBody under 150 words

Return the result ONLY as valid JSON in this exact format:

[
  {
    "name": "Template Name",
    "subject": "Email subject",
    "intro": "Intro text using {{name}}",
    "mainBody": "Main message content",
    "footer": "Footer with sender email ${senderEmail}"
  }
]

User prompt:
${prompt}
  `);

  const text = result.response.text();
  const cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleanText);
}
