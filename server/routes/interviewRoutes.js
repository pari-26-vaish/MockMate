import express from "express";
import createInterview from "../controllers/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import creditMiddleware from "../middleware/creditMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  creditMiddleware,
  createInterview
);

export default router;