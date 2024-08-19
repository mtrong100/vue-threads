import express from "express";
import {
  getUserById,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendOtpCode,
  toggleFollowUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  sendOtpSchema,
  updateProfileSchema,
} from "../validations/userValidation.js";

const router = express.Router();

router.get("/", protect, getUsers);

router.get("/:id", protect, getUserById);

router.post("/register", validate(registerUserSchema), registerUser);

router.post("/login", validate(loginUserSchema), loginUser);

router.post("/logout", protect, logoutUser);

router.post("/toggle-follow/:id", protect, toggleFollowUser);

router.put(
  "/profile",
  protect,
  validate(updateProfileSchema),
  updateUserProfile
);

router.post("/send-otp-code", validate(sendOtpSchema), sendOtpCode);

router.put("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
