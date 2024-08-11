import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateOtpCode } from "../utils/helper.js";
import { sendOtpEmail } from "../libs/nodemailer.js";

const registerUser = async ({ username, email, password, confirmPassword }) => {
  const userExists = await User.findOne({ email });

  if (userExists) throw new Error("User already exists");
  if (password !== confirmPassword) throw new Error("Passwords do not match");

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  const validPassword = await bcrypt.compareSync(password, user.password);

  if (!validPassword) throw new Error("Wrong password");

  const payload = { userId: user._id };

  const results = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
  };

  return { payload, results };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select(
    "-password -resetPasswordOtp -resetPasswordExpires"
  );

  if (!user) throw new Error("User not found");

  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const { username, email, bio, profilePicture } = updateData;

  if (username) user.username = username;
  if (email) user.email = email;
  if (bio) user.bio = bio;
  if (profilePicture) user.profilePicture = profilePicture;

  await user.save();

  return user;
};

const sendOtpCode = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  const otpCode = generateOtpCode();

  user.resetPasswordOtp = otpCode;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendOtpEmail(email, "Otp code for reset your password", otpCode);
};

export const resetPassword = async ({
  email,
  otpCode,
  newPassword,
  confirmPassword,
}) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  if (user.resetPasswordOtp !== otpCode) throw new Error("Invalid OTP code");

  if (user.resetPasswordExpires < Date.now())
    throw new Error("OTP code expired");

  if (newPassword !== confirmPassword)
    throw new Error("Passwords do not match");

  const hashedPassword = await bcrypt.hashSync(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordOtp = null;
  user.resetPasswordExpires = null;

  await user.save();
};

export {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  sendOtpCode,
  resetPassword,
};
