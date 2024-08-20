import express from "express";
import userRouter from "./userRouter.js";
import postRouter from "./postRouter.js";
import commentRouter from "./commentRouter.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);

export default router;
