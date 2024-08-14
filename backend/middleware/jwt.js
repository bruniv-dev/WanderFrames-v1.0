import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const authenticateToken = async (req, res, next) => {
  // Log the entire authorization header
  console.log("Authorization Header:", req.headers["authorization"]);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from 'Bearer TOKEN' format

  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ message: "No token provided." }); // Unauthorized if no token is present
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.error("Token expired:", err);
          return res
            .status(401)
            .json({ message: "Token expired, please log in again." }); // Specific message for token expiration
        }

        console.error("Token verification error:", err);
        return res.status(403).json({ message: "Invalid token." }); // Forbidden if token is invalid
      }

      // Log the decoded user information from the token
      console.log("Decoded User from Token:", user);

      // Fetch user from the database
      const dbUser = await User.findById(user._id);
      if (!dbUser) {
        console.log("User not found in database.");
        return res
          .status(403)
          .json({ message: "User not found, authentication failed." }); // Forbidden if user is not found in the database
      }

      // Attach user to request object
      req.user = dbUser;
      console.log("Authenticated User:", req.user);
      next(); // Proceed to next middleware or route handler
    });
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    res.status(500).json({ message: "Internal server error." }); // Internal Server Error
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
