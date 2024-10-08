import Joi from "joi";

export const createPostSchema = Joi.object({
  content: Joi.string().max(500).optional().allow(""),
  images: Joi.array()
    .items(
      Joi.string().pattern(/^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/),
      Joi.string().uri()
    )
    .max(4)
    .optional(),
}).or("content", "images");
