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

const getUserHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Interview history fetched successfully",
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interview history",
      error: error.message,
    });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    const questions = await Question.find({
      interviewId: interview._id,
    });

    res.status(200).json({
      message: "Interview details fetched successfully",
      interview,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interview details",
      error: error.message,
    });
  }
};


export {
  createInterview,
  getUserHistory,
  getInterviewById,
};