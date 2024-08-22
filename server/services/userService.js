import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateOtpCode } from "../utils/helper.js";
import { sendOtpEmail } from "../libs/nodemailer.js";
import Post from "../models/postModel.js";
import mongoose from "mongoose";

const getFriends = async (userId) => {
  const friends = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId), // Match the current user by ID
      },
    },
    {
      $project: {
        following: 1, // Project only the following and followers arrays
        followers: 1,
      },
    },
    {
      $addFields: {
        mutualFriends: {
          $setIntersection: ["$following", "$followers"], // Find the intersection of following and followers arrays
        },
      },
    },
    {
      $lookup: {
        from: "users", // Lookup user details for mutual friends
        localField: "mutualFriends",
        foreignField: "_id",
        as: "friends",
      },
    },
    {
      $project: {
        friends: {
          _id: 1,
          username: 1,
          profilePicture: 1, // Project only the fields you need for mutual friends
        },
      },
    },
  ]);

  if (!friends || friends.length === 0)
    throw new Error("No mutual friends found");

  return friends[0].friends; // Return the list of mutual friends
};

const getUsers = async (currentUserId, limit, skip, query) => {
  const users = await User.find({
    username: { $regex: query, $options: "i" },
    _id: { $ne: currentUserId },
  })
    .skip(skip)
    .limit(limit)
    .exec();

  const totalUsers = await User.countDocuments({
    username: { $regex: query, $options: "i" },
    _id: { $ne: currentUserId },
  });

  if (!users || users.length === 0) throw new Error("No users found");

  const results = users.map((user) => {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      postCount: user.posts.length,
      following: user.following,
      followers: user.followers,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };
  });

  return { results, totalUsers };
};

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
    bio: user.bio,
    postCount: user.posts.length,
    followersCount: user.followers.length,
    followingCount: user.following.length,
  };

  return { payload, results };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select(
    "-password -resetPasswordOtp -resetPasswordExpires"
  );

  const posts = await Post.countDocuments({ userId: user._id });

  if (!user) throw new Error("User not found");

  const results = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    postCount: posts || 0,
    followersCount: user.followers.length,
    followingCount: user.following.length,
  };

  return results;
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

  const results = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    postCount: user.posts.length,
    followersCount: user.followers.length,
    followingCount: user.following.length,
  };

  return results;
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

const resetPassword = async ({
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

const toggleFollowUser = async (userId, followerId) => {
  try {
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      throw new Error("User not found");
    }

    const isFollowing = user.following.includes(followerId);

    if (isFollowing) {
      user.following = user.following?.filter(
        (id) => id.toString() !== followerId.toString()
      );
      follower.followers = follower.followers?.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      user.following.push(followerId);
      follower.followers.push(userId);
    }

    await follower.save();
    await user.save();

    return {
      success: true,
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  sendOtpCode,
  resetPassword,
  getUsers,
  toggleFollowUser,
  getFriends,
};
