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
    password: yup
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .required("Password cannot be empty."),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref("password")], "Passwords do not match.")
      .required("Please confirm your password."),
  })
);
