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

    req.user = user;
    console.log(req.user);
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

export const checkPostOwnership = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.userId; // Assumes `req.user` contains the authenticated user info
  console.log(`userID from token put ${userId}`);
  try {
    const post = await Post.findById(postId); // Replace with your ORM or DB query
    if (!post) {
      return res.sendStatus(404); // Post not found
    }
    console.log(`user id from fetched post ${post.user}`);
    if (post.user.toString() !== userId.toString()) {
      return res.sendStatus(403); // Forbidden if not the owner and not an admin
    }

    next(); // Proceed to the controller if ownership or admin check passes
  } catch (error) {
    console.error("Error checking ownership:", error);
    res.sendStatus(500); // Internal server error
  }
};

// export const refreshToken = (req, res) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken)
//     return res.status(401).json({ message: "No refresh token provided" });

//   jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid refresh token" });

//     const accessToken = jwt.sign(
//       { userId: user.userId },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" } // Access token expires in 1 hour
//     );

//     res.status(200).json({
//       accessToken,
//       message: "Access token refreshed successfully",
//     });
//   });
// };
