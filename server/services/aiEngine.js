import gemini from "../config/gemini.js";
import parseAIResponse from "../utils/jsonParser.js";
import {
  interviewPrompt,
  evaluationPrompt,
} from "../utils/promptTemplates.js";

const generateQuestionsFromAI = async ({
  role,
  experience,
  techStack,
  resumeText,
}) => {
  const prompt = `
Generate 5 interview questions for a ${role} candidate.

Experience: ${experience}
Tech Stack: ${techStack}
Resume: ${resumeText}

Return ONLY a valid JSON array in this format:

[
  {
    "question": "Question text",
    "answer": "Expected answer"
  }
]
`;

  const response = await gemini.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return parseAIResponse(response.text);
};

export const evaluateAnswerAI = async ({ question, userResponse }) => {
  try {
    const prompt = evaluationPrompt({
      question,
      userResponse,
    });

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: prompt,
    });

    const text = response.text;

    console.log("AI Evaluation Response:", text);

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const evaluation = JSON.parse(cleanedText);

    return evaluation;
  } catch (error) {
    console.error("AI Answer Evaluation Error:", error);
    throw new Error("Failed to evaluate answer");
  }
};

export default generateQuestionsFromAI;