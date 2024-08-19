// post-routes.js
import { Router } from "express";
import path from "path";
import multer from "multer";

import {
  addPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post-controllers.js";

import { authenticateToken } from "../middleware/jwt.js";

import { checkPostOwnershipAndAdminPrivileges } from "../middleware/jwt.js";

// Multer setup for multiple file uploads
const storageMultiple = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadMultiple = multer({ storage: storageMultiple }).array("images", 3); // Limit to 3 files

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.post("/addPost", authenticateToken, uploadMultiple, addPost);
postRouter.get("/:id", authenticateToken, getPostById);

postRouter.put(
  "/:id",
  authenticateToken,
  checkPostOwnershipAndAdminPrivileges,
  updatePost
);

postRouter.delete(
  "/:id",
  authenticateToken,
  checkPostOwnershipAndAdminPrivileges,
  deletePost
);

export default postRouter;
