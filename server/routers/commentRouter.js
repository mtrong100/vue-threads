import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:postId", getCommentsByPostId);

router.post("/create/:postId", protect, createComment);

router.delete("/delete/:id", protect, deleteComment);

export default router;
