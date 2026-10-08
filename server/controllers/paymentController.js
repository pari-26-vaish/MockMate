import crypto from "crypto";

import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, credits } = req.body;

    if (!amount || !credits) {
      return res.status(400).json({
        message: "Amount and credits are required",
      });
    }

    // Create a fake payment ID
    const paymentId = `mock_${crypto.randomUUID()}`;

    // Save transaction as completed
    const transaction = await Transaction.create({
      userId: req.userId,
      paymentId,
      amount,
      creditsAdded: credits,
      status: "completed",
    });

    // Increase user's credits
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $inc: {
          credits: credits,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Mock payment successful",
      paymentId,
      transactionId: transaction._id,
      creditsAdded: credits,
      totalCredits: user.credits,
    });
  } catch (error) {
    console.error("Mock payment error:", error);

    res.status(500).json({
      message: "Mock payment failed",
    });
  }
};