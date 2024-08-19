import express from "express";
import {
  createPost,
  deletePost,
  getPostDetails,
  getPosts,
  updatePost,
  getPostsByUser,
  toggleLikePost,
  getLikedPostsByUser,
  getPostsFromFollowingUsers,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createPostSchema } from "../validations/postValidation.js";

const router = express.Router();

router.get("/", getPosts);

router.get("/like-posts", protect, getLikedPostsByUser);

router.get("/following-posts", protect, getPostsFromFollowingUsers);

router.get("/:id", getPostDetails);

router.get("/user/:id", getPostsByUser);

router.post("/create", protect, validate(createPostSchema), createPost);

router.post("/:postId/like", protect, toggleLikePost);

router.put("/update/:id", protect, validate(createPostSchema), updatePost);

router.delete("/delete/:id", protect, deletePost);

export default router;
