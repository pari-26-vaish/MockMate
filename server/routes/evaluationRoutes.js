import express from "express";
import { evaluateAnswerAI } from "../services/aiEngine.js";

const router = express.Router();

router.post("/evaluate", async (req, res) => {
  try {
    const { question, userResponse } = req.body;

    if (!question || !userResponse) {
      return res.status(400).json({
        message: "Question and user response are required",
      });
    }

    const evaluation = await evaluateAnswerAI({
      question,
      userResponse,
    });

    res.status(200).json(evaluation);
  } catch (error) {
    console.error("Evaluation route error:", error);

    res.status(500).json({
      message: "Failed to evaluate answer",
    });
  }
});

export default router;