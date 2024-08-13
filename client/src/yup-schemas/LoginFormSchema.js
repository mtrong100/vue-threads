import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";

export const schema = toTypedSchema(
  yup.object({
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
  })
);
