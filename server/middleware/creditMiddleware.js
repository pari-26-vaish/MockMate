import User from "../models/User.js";

const creditMiddleware = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.credits <= 0) {
      return res.status(403).json({
        message: "Insufficient credits",
      });
    }

    req.userData = user;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Credit verification failed",
      error: error.message,
    });
  }
};

export default creditMiddleware;