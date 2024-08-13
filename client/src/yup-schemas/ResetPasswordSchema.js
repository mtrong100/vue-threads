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
    newPassword: yup
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .required("Password cannot be empty."),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref("newPassword")], "Passwords do not match.")
      .required("Please confirm your password."),
    otpCode: yup
      .string()
      .trim()
      .matches(/^\d{6}$/, "OTP code must be exactly 6 digits.")
      .required("OTP code is required."),
  })
);
