import express from "express";
import {
  createInterview,
  getUserHistory,
  getInterviewById,
} from "../controllers/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import creditMiddleware from "../middleware/creditMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  creditMiddleware,
  createInterview
);

router.get(
  "/history",
  authMiddleware,
  getUserHistory
);

router.get(
  "/:id",
  authMiddleware,
  getInterviewById
);

export default router;