import express from "express";
import {
  createPost,
  deletePost,
  getPostDetails,
  getPosts,
  updatePost,
  getPostsByUser,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createPostSchema } from "../validations/postValidation.js";

const router = express.Router();

router.get("/", getPosts);

router.get("/:id", getPostDetails);

router.get("/user/:id", getPostsByUser);

router.post("/create", protect, validate(createPostSchema), createPost);

router.put("/update/:id", protect, validate(createPostSchema), updatePost);

router.delete("/delete/:id", protect, deletePost);

export default router;
