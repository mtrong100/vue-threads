import express from "express";
import { createPost } from "../controllers/postController.js";
import upload from "../libs/multer.js";

const router = express.Router();

router.post("/create", upload.array("images"), createPost);

export default router;
