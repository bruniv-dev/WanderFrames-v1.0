import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const authenticateToken = async (req, res, next) => {
  console.log("Cookies:", req.cookies); // Add this line to debug
  const token = req.cookies["token"];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    const dbUser = await User.findById(user.userId);
    if (!dbUser) {
      return res
        .status(403)
        .json({ message: "User not found, authentication failed." });
    }

    req.user = user; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again." });
    }
    return res.status(403).json({ message: "Invalid token." });
  }
};

export const authorizePostEdit = async (req, res, next) => {
  console.log("ab");
  const postId = req.params._id;
  const userId = req.user._id;

  console.log("User ID:", req.user.id);
  console.log("Post ID:", req.params.id);

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to edit this post",
      });
    }

    next(); // User is authorized to edit this post
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Access token expires in 1 hour
    );

    res.status(200).json({
      accessToken,
      message: "Access token refreshed successfully",
    });
  });
};
