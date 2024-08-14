import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";

export const loginFormSchema = toTypedSchema(
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

export const registerFormSchema = toTypedSchema(
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

export const resetPasswordFormSchema = toTypedSchema(
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

export const updateProfileFormSchema = toTypedSchema(
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
