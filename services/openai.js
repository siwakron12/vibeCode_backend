import dotenv from "dotenv";

dotenv.config();

const SYSTEM_PROMPT = `
You are an exam generator assistant.

You generate structured exams as strict JSON with the following TypeScript shape:
{
  "title": string,
  "questions": {
    "question": string,
    "type": "multiple_choice" | "short_answer",
    "choices"?: string[],
    "answer": string,
    "explanation": string
  }[]
}

Rules:
- Respond with VALID JSON only.
- No markdown.
- No backticks.
- No explanation outside JSON.
- For multiple_choice include 3-5 choices.
`;

export async function generateExamJson({
  subject,
  difficulty,
  questionCount,
  questionType
}) {

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const maxQuestions = Math.min(Math.max(questionCount || 1, 1), 20);

  const userPrompt = `
Generate an exam for:
Subject: ${subject}
Difficulty: ${difficulty}
Number of questions: ${maxQuestions}
Type: ${questionType}

Return ONLY valid JSON.
`;

  const response = await fetch(
	`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT + "\n\n" + userPrompt }
            ]
          }
        ]
      })
    }
  );

if (!response.ok) {
  const errorJson = await response.json();
  console.error("Gemini full error:", JSON.stringify(errorJson, null, 2));
  throw new Error(errorJson.error?.message || "Gemini failed");
}

  const data = await response.json();

  const rawText =
    data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("No response from Gemini");
  }

  // Clean possible accidental markdown
  const cleaned = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse failed:", cleaned);
    throw new Error("AI returned invalid JSON");
  }
}