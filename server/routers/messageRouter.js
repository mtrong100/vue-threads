import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:receiverId", protect, getMessages);

router.post("/send/:receiverId", protect, sendMessage);

export default router;
