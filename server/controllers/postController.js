import * as postService from "../services/postService.js";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { images, content } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const uploadedImages = await Promise.all(
      images.map(async (base64Image) => {
        try {
          const result = await uploadImageToCloudinary(base64Image);
          return result.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError.message);
          throw new Error("Failed to upload some images");
        }
      })
    );

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
