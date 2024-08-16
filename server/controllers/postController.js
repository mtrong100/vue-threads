import * as postService from "../services/postService.js";
import { POST_LIMIT } from "../utils/constant.js";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary.js";

export const getPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || POST_LIMIT;
    const { results, totalPosts } = await postService.getPosts(limit);
    return res.status(200).json({
      message: "Posts fetched successfully",
      results,
      totalPosts,
    });
  } catch (error) {
    console.error("Error getting posts:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const getPostDetails = async (req, res) => {
  try {
    const results = await postService.getPostDetails(req.params.id);
    return res.status(200).json({
      message: "Post details fetched successfully",
      results,
    });
  } catch (error) {
    console.error("Error getting post details:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || POST_LIMIT;
    const { results, totalUserPosts } = await postService.getPostsByUser(
      req.params.id,
      limit
    );
    return res.status(200).json({
      message: "Posts fetched successfully",
      results,
      totalUserPosts,
    });
  } catch (error) {
    console.error("Error getting posts by user:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const getLikedPostsByUser = async (req, res) => {
  try {
    const results = await postService.getLikedPostsByUser(req.user._id);
    return res.status(200).json({
      message: "Liked posts fetched successfully",
      results,
    });
  } catch (error) {
    console.error("Error getting liked posts by user:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { images, content } = req.body;

    const uploadedImages =
      images.length > 0
        ? await Promise.all(
            images.map(async (base64Image) => {
              try {
                const result = await uploadImageToCloudinary(base64Image);
                return result.secure_url;
              } catch (uploadError) {
                console.error("Error uploading image:", uploadError.message);
                throw new Error("Failed to upload some images");
              }
            })
          )
        : [];

    const body = {
      content,
      userId: req.user._id,
      images: uploadedImages,
    };

    const results = await postService.createPost(body);

    return res.status(201).json({
      message: "Post created successfully",
      results,
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const results = await postService.updatePost(
      req.params.id,
      req.user._id,
      req.body
    );
    return res.status(200).json({
      message: "Post updated successfully",
      results,
    });
  } catch (error) {
    console.log("Error updating post:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id);
    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting post:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    const results = await postService.toggleLikePost({ postId, userId });

    return res.status(200).json({
      message: "Like toggled successfully",
      results,
    });
  } catch (error) {
    console.log("Error toggling like:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
