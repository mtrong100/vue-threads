import * as userService from "../services/userService.js";
import { USER_LIMIT } from "../utils/constant.js";
import { generateTokenAndSetCookie } from "../utils/helper.js";

export const getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || USER_LIMIT;
    const skip = parseInt(req.query.skip) || 0;
    const query = req.query.query || "";

    const { results, totalUsers } = await userService.getUsers(
      req.user._id,
      limit,
      skip,
      query
    );

    const hasMoreUsers = results.length === limit;

    return res.status(200).json({
      message: "Users fetched successfully",
      results,
      totalUsers,
      hasMoreUsers,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    await userService.registerUser(req.body);
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { payload, results } = await userService.loginUser(req.body);

    generateTokenAndSetCookie(payload, res);

    return res.status(200).json({
      message: "Login successful",
      results,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("VUE_THREADS_COOKIES");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.user._id,
      req.body
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      results: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Send OTP code to email for password reset
// @route   POST /api/users/send-otp-code
// @access  Public
export const sendOtpCode = async (req, res) => {
  try {
    await userService.sendOtpCode(req.body.email);
    return res.status(200).json({ message: "OTP code sent to your email" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Reset password using OTP code
// @route   PUT /api/users/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req.body);

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const toggleFollowUser = async (req, res) => {
  try {
    await userService.toggleFollowUser(req.user._id, req.params.id);
    return res.status(200).json({ message: "Following user successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
