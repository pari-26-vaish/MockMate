import gemini from "../config/gemini.js";
import buildInterviewPrompt from "../utils/promptTemplates.js";

const generateInterviewQuestions = async ({
  role,
  experience,
  techStack,
  resumeText,
}) => {
  const prompt = buildInterviewPrompt({
    role,
    experience,
    techStack,
    resumeText,
  });

  const response = await gemini.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
};

export default generateInterviewQuestions;