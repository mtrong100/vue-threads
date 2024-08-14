export const createPost = async (req, res) => {
  try {
    //...
  } catch (error) {
    console.log("Error creating post:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
