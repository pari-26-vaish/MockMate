import gemini from "../config/gemini.js";
import parseAIResponse from "../utils/jsonParser.js";

import buildInterviewPrompt, {
  evaluationPrompt,
} from "../utils/promptTemplates.js";

// Generate interview questions using AI
const generateQuestionsFromAI = async ({
  role,
  experience,
  techStack,
  resumeText,
}) => {
  try {
    const prompt = buildInterviewPrompt({
      role,
      experience,
      techStack,
      resumeText,
    });

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      contents: prompt,
    });

    console.log("AI Question Response:", response.text);

    return parseAIResponse(response.text);
  } catch (error) {
    console.error("AI Question Generation Error:", error);

    throw new Error("Failed to generate interview questions");
  }
};

// Evaluate candidate's answer using AI
export const evaluateAnswerAI = async ({
  question,
  userResponse,
}) => {
  try {
    const prompt = evaluationPrompt({
      question,
      userResponse,
    });

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      contents: prompt,
    });

    console.log("AI Evaluation Response:", response.text);

    return parseAIResponse(response.text);
  } catch (error) {
    console.error("AI Answer Evaluation Error:", error);

    throw new Error("Failed to evaluate answer");
  }
};

export default generateQuestionsFromAI;