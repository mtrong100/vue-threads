import Post from "../models/postModel.js";

const createPost = async ({ content, userId, images }) => {
  const newPost = new Post({
    content,
    userId,
    images,
  });

  await newPost.save();

  return newPost;
};

export { createPost };
