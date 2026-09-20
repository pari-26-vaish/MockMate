import Question from "../models/Question.js";
import { evaluateAnswerAI } from "../services/aiEngine.js";

export const evaluateAnswer = async (req, res) => {
  try {
    const { questionId, userResponse } = req.body;

    // Validate input
    if (!questionId || !userResponse) {
      return res.status(400).json({
        message: "Question ID and user response are required",
      });
    }

    // Find question
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Evaluate answer using AI
    const evaluation = await evaluateAnswerAI({
      question: question.questionText,
      userResponse,
    });

    // Update question document
    question.userAnswer = userResponse;

    question.aiFeedback = JSON.stringify({
      keyStrengths: evaluation.keyStrengths,
      areasOfImprovement: evaluation.areasOfImprovement,
      idealAnswer: evaluation.idealAnswer,
    });

    question.score = evaluation.score;

    await question.save();

    res.status(200).json({
      message: "Answer evaluated successfully",
      evaluation,
      questionId: question._id,
    });
  } catch (error) {
    console.error("Evaluate answer controller error:", error);

    res.status(500).json({
      message: "Failed to evaluate answer",
    });
  }
};