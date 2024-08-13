import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";

export const schema = toTypedSchema(
  yup.object({
    username: yup
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long.")
      .max(20, "Username must be at most 20 characters long.")
      .required("Please enter your username."),
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .transform((value) => value.toLowerCase())
      .required("Email is required."),
    bio: yup
      .string()
      .trim()
      .max(160, "Bio must be at most 160 characters long.")
      .optional(),
    profilePicture: yup
      .string()
      .url("Please enter a valid URL for your profile picture.")
      .required("Profile picture is required."),
  })
);
