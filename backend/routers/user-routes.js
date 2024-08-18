// user-routes.js
import { Router } from "express";
import multer from "multer";
import { uploadDir } from "../app.js";
import {
  getAllUsers,
  login,
  signup,
  deleteUser,
  toggleFavorite,
  getFavorites,
  getUserProfile,
  getUserPosts,
  getUserById,
  deleteUserAccount,
  updateUserProfile,
  verifySecurityAnswer,
  resetPassword,
  updateUserIsAdmin,
  checkUsernameAvailability,
  requestReset,
  forgotPasswordReset,
  getUserByToken,
  logoutUser,
} from "../controllers/user-controllers.js";

import { authenticateToken } from "../middleware/jwt.js";

// Multer setup
const storageSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});
const uploadSingle = multer({ storage: storageSingle });
// const upload = multer({ dest: "uploads/" }); // Configure multer
const userRouter = Router();
// Define routes
userRouter.get("/", getAllUsers);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/check-username/:username", checkUsernameAvailability);
userRouter.get("/:userId", authenticateToken, getUserById);
userRouter.get("/by-token/me", authenticateToken, getUserByToken);
userRouter.post("/logout", authenticateToken, logoutUser);
userRouter.get("/profile/:id", authenticateToken, getUserProfile);
userRouter.get("/posts/:userId", authenticateToken, getUserPosts);
userRouter.put(
  "/:userId",
  uploadSingle.single("profileImage"),
  authenticateToken,
  updateUserProfile
);
userRouter.delete("/:id", authenticateToken, deleteUserAccount);
userRouter.delete("/:id", authenticateToken, deleteUser);
userRouter.post("/verifySecurityAnswer", verifySecurityAnswer);
userRouter.post("/toggleFavorite", authenticateToken, toggleFavorite);
userRouter.get("/favorites/:userId", authenticateToken, getFavorites);
userRouter.post("/reset-password/:userId", authenticateToken, resetPassword);
userRouter.put("/:userId/isAdmin", authenticateToken, updateUserIsAdmin);
userRouter.post("/requestReset", requestReset);
userRouter.post("/forgot-password-reset/:userId", forgotPasswordReset);

// userRouter.get("/check-auth", authenticateToken, checkAuth);
export default userRouter;
