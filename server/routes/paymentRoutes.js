import express from "express";

import { createCheckoutSession } from "../controllers/paymentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route: user must be logged in
router.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSession
);

export default router;