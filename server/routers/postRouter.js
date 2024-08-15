import express from "express";
import { createPost } from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createPostSchema } from "../validations/postValidation.js";

const router = express.Router();

router.post("/create", protect, validate(createPostSchema), createPost);

export default router;
