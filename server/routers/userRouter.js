import express from "express";
import {
  getUserById,
  loginUser,
  registerUser,
  resetPassword,
  sendOtpCode,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to register a new user
router.post("/register", registerUser);

// Route to login a user
router.post("/login", loginUser);

// Route to get user profile by ID (protected route)
router.get("/:id", protect, getUserById);

// Route to update user profile (protected route)
router.put("/profile", protect, updateUserProfile);

// Route to request password reset (send email with token)
router.post("/send-otp-code", sendOtpCode);

// Route to reset the password
router.put("/reset-password", resetPassword);

export default router;
