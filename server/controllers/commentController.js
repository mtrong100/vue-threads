import Comment from "../models/commentModel.js";

export const getCommentsByPostId = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || POST_LIMIT;
    const skip = parseInt(req.query.skip) || 0;

    const comments = await Comment.find({ postId: req.params.postId })
      .populate([
        {
          path: "userId",
          select: "_id username profilePicture",
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments({
      postId: req.params.postId,
    });

    const hasMoreComments = comments.length === limit;

    const results = comments.map((comment) => ({
      _id: comment._id,
      text: comment.text,
      postId: comment.postId,
      userId: comment.userId._id,
      username: comment.userId.username,
      profilePicture: comment.userId.profilePicture,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return res.status(200).json({ results, totalComments, hasMoreComments });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const body = {
      userId: req.user._id,
      postId: req.params.postId,
      text: req.body.text,
    };

    const comment = new Comment(body);

    await comment.save();

    return res
      .status(200)
      .json({ message: "Comment created successfully", resutls: comment });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
