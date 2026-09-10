import Interview from "../models/Interview.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import generateQuestionsFromAI from "../services/aiEngine.js";

const createInterview = async (req, res) => {
  try {
    const { role, experience, techStack, resumeText } = req.body;

    const user = req.userData;

    // Generate questions using AI
    const generatedQuestions = await generateQuestionsFromAI({
      role,
      experience,
      techStack,
      resumeText,
    });

    // Create interview
    const interview = await Interview.create({
      userId: user._id,
      role,
      techStack,
      experienceLevel: experience,
    });

    // Save generated questions
    const questions = generatedQuestions.map((item) => ({
      interviewId: interview._id,
      questionText: item.question,
    }));

    await Question.insertMany(questions);

    // Deduct 1 credit
    await User.findByIdAndUpdate(user._id, {
      $inc: { credits: -1 },
    });

    res.status(201).json({
      message: "Interview created successfully",
      interview,
      questions,
      remainingCredits: user.credits - 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create interview",
      error: error.message,
    });
  }
};

export default createInterview;