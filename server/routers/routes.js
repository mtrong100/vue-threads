import express from "express";
import userRouter from "./userRouter.js";
import postRouter from "./postRouter.js";
import commentRouter from "./commentRouter.js";
import messageRouter from "./messageRouter.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);
router.use("/messages", messageRouter);

export default router;
