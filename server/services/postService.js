import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const getPosts = async (limit) => {
  const posts = await Post.find()
    .populate({
      path: "userId",
      select: "_id username profilePicture",
    })
    .sort({ createdAt: -1 })
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  if (!posts || posts.length === 0) {
    throw new Error("Posts not found");
  }

  const results = posts.map((post) => {
    return {
      _id: post._id,
      content: post.content,
      images: post.images,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      author: {
        authorId: post.userId._id,
        username: post.userId.username,
        profilePicture: post.userId.profilePicture,
      },
      createdAt: post.createdAt,
    };
  });

  return {
    results,
    totalPosts,
  };
};

const getPostDetails = async (postId) => {
  const post = await Post.findById(postId).populate({
    path: "userId",
    select: "_id username profilePicture",
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const results = {
    _id: post._id,
    content: post.content,
    images: post.images,
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    author: {
      authorId: post.userId._id,
      username: post.userId.username,
      profilePicture: post.userId.profilePicture,
    },
    createdAt: post.createdAt,
  };

  return results;
};

const getPostsByUser = async (userId, limit) => {
  const posts = await Post.find({ userId })
    .populate({
      path: "userId",
      select: "_id username profilePicture",
    })
    .sort({ createdAt: -1 })
    .limit(limit);

  const totalUserPosts = await Post.countDocuments({ userId });

  if (!posts || posts.length === 0) {
    throw new Error("Posts not found");
  }

  const results = posts.map((post) => {
    return {
      _id: post._id,
      content: post.content,
      images: post.images,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      author: {
        authorId: post.userId._id,
        username: post.userId.username,
        profilePicture: post.userId.profilePicture,
      },
      createdAt: post.createdAt,
    };
  });

  return {
    results,
    totalUserPosts,
  };
};

const createPost = async ({ content, userId, images }) => {
  const user = await User.findById(userId);

  const newPost = new Post({
    content,
    userId,
    images,
  });

  const savePost = await newPost.save();

  const results = {
    _id: savePost._id,
    content: savePost.content,
    images: savePost.images,
    likesCount: savePost.likes.length,
    commentsCount: savePost.comments.length,
    author: {
      authorId: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
    },
    createdAt: savePost.createdAt,
  };

  return results;
};

const updatePost = async (postId, userId, postData) => {
  const user = await User.findById(userId);

  const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
    new: true,
  });

  if (!updatedPost) {
    throw new Error("Post not found");
  }

  const results = {
    _id: updatedPost._id,
    content: updatedPost.content,
    images: updatedPost.images,
    likesCount: updatedPost.likes.length,
    commentsCount: updatedPost.comments.length,
    author: {
      authorId: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
    },
    createdAt: updatedPost.createdAt,
  };

  return results;
};

const deletePost = async (postId) => {
  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) {
    throw new Error("Post not found");
  }
};

export {
  createPost,
  updatePost,
  getPosts,
  deletePost,
  getPostDetails,
  getPostsByUser,
};
