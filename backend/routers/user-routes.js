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
userRouter.get("/:userId", getUserById);
userRouter.get("/by-token/me", getUserByToken);
userRouter.post("/logout", logoutUser);

userRouter.delete("/:id", deleteUser);
userRouter.post("/toggleFavorite", toggleFavorite);
userRouter.get("/favorites/:userId", getFavorites);
userRouter.get("/profile/:id", getUserProfile);
userRouter.get("/posts/:userId", getUserPosts);
userRouter.delete("/:id", deleteUserAccount);
userRouter.put(
  "/:userId",
  uploadSingle.single("profileImage"),
  updateUserProfile
);
userRouter.put("/:userId/isAdmin", updateUserIsAdmin);
userRouter.post("/requestReset", requestReset);
userRouter.post("/verifySecurityAnswer", verifySecurityAnswer);
userRouter.post("/forgot-password-reset/:userId", forgotPasswordReset);
userRouter.post("/reset-password/:userId", resetPassword);
userRouter.get("/check-username/:username", checkUsernameAvailability);

export default userRouter;
