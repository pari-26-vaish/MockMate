import gemini from "../config/gemini.js";
import parseAIResponse from "../utils/jsonParser.js";

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

export default generateQuestionsFromAI;