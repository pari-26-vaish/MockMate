import express from "express";
import { generateQuestions } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-questions", authMiddleware, generateQuestions);

export default router;