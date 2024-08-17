import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const getPosts = async (limit, skip) => {
  const posts = await Post.find()
    .populate({
      path: "userId",
      select: "_id username profilePicture",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  return {
    results: posts.map((post) => ({
      _id: post._id,
      content: post.content,
      images: post.images,
      likes: post.likes,
      comments: post.comments,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      userId: post.userId._id,
      username: post.userId.username,
      profilePicture: post.userId.profilePicture,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })),
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
    likes: post.likes,
    comments: post.comments,
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    userId: post.userId._id,
    username: post.userId.username,
    profilePicture: post.userId.profilePicture,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };

  return results;
};

const getPostsByUser = async (userId, limit, skip) => {
  const posts = await Post.find({ userId })
    .populate({
      path: "userId",
      select: "_id username profilePicture",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments({ userId });

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
      likes: post.likes,
      comments: post.comments,
      userId: post.userId._id,
      username: post.userId.username,
      profilePicture: post.userId.profilePicture,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  });

  return {
    results,
    totalPosts,
  };
};

const getLikedPostsByUser = async (userId, limit, skip) => {
  try {
    const likedPosts = await Post.find({ likes: userId })
      .populate("userId", "_id username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPosts = await Post.countDocuments({ likes: userId });

    if (!likedPosts || likedPosts.length === 0) {
      throw new Error("Liked posts not found");
    }

    const results = likedPosts.map((post) => {
      return {
        _id: post._id,
        content: post.content,
        images: post.images,
        likes: post.likes,
        comments: post.comments,
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
        userId: post.userId._id,
        username: post.userId.username,
        profilePicture: post.userId.profilePicture,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });

    return { results, totalPosts };
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    throw new Error("Error fetching liked posts");
  }
};

const createPost = async ({
  content,
  userId,
  username,
  profilePicture,
  images,
}) => {
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
    likes: savePost.likes,
    comments: savePost.comments,
    likesCount: savePost.likes.length,
    commentsCount: savePost.comments.length,
    userId,
    username,
    profilePicture,
    createdAt: savePost.createdAt,
    updatedAt: savePost.updatedAt,
  };

  return results;
};

const updatePost = async (
  postId,
  { userId, username, profilePicture, ...postData }
) => {
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
    likes: updatedPost.likes,
    comments: updatedPost.comments,
    likesCount: updatedPost.likes.length,
    commentsCount: updatedPost.comments.length,
    userId,
    username,
    profilePicture,
    createdAt: updatedPost.createdAt,
    updatedAt: updatedPost.updatedAt,
  };

  return results;
};

const deletePost = async (postId) => {
  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) {
    throw new Error("Post not found");
  }
};

const toggleLikePost = async ({ postId, userId }) => {
  const post = await Post.findById(postId).populate({
    path: "userId",
    select: "_id username profilePicture",
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const hasLiked = post.likes.includes(userId);

  if (hasLiked) {
    // If the user has already liked the post, remove the like
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());

    const savePost = await post.save();

    const results = {
      _id: savePost._id,
      content: savePost.content,
      images: savePost.images,
      likes: savePost.likes,
      comments: savePost.comments,
      likesCount: savePost.likes.length,
      commentsCount: savePost.comments.length,
      userId: savePost.userId._id,
      username: savePost.userId.username,
      profilePicture: savePost.userId.profilePicture,
      createdAt: savePost.createdAt,
      updatedAt: savePost.updatedAt,
    };

    return { message: "Post unliked successfully", results };
  } else {
    // If the user hasn't liked the post, add the like
    post.likes.push(userId);

    const savePost = await post.save();

    const results = {
      _id: savePost._id,
      content: savePost.content,
      images: savePost.images,
      likes: savePost.likes,
      comments: savePost.comments,
      likesCount: savePost.likes.length,
      commentsCount: savePost.comments.length,
      userId: savePost.userId._id,
      username: savePost.userId.username,
      profilePicture: savePost.userId.profilePicture,
      createdAt: savePost.createdAt,
      updatedAt: savePost.updatedAt,
    };

    return { message: "Post liked successfully", results };
  }
};

export {
  createPost,
  updatePost,
  getPosts,
  deletePost,
  getPostDetails,
  getPostsByUser,
  toggleLikePost,
  getLikedPostsByUser,
};
