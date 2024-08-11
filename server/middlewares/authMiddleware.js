import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  // Check if the token is in cookies
  if (req.cookies && req.cookies.VUE_THREADS_COOKIES) {
    try {
      token = req.cookies.VUE_THREADS_COOKIES;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if JWT_SECRET is set
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      // Find the user and attach to the request object
      req.user = await User.findById(decoded.userId).select("-password");

      // Proceed to next middleware
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
