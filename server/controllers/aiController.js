import generateQuestionsFromAI from "../services/aiEngine.js";

export const generateQuestions = async (req, res) => {
  try {
    const { role, experience, techStack, resumeText } = req.body;

    if (!role || !experience || !techStack) {
      return res.status(400).json({
        message: "Role, experience and tech stack are required",
      });
    }

    const questions = await generateQuestionsFromAI({
      role,
      experience,
      techStack,
      resumeText: resumeText || "",
    });

    res.status(200).json({
      message: "Interview questions generated successfully",
      questions,
    });
  } catch (error) {
    console.error("AI question generation error:", error);

    res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};