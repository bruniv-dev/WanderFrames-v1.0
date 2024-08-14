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
import { authorizePostEdit } from "../middleware/jwt.js";

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

// Define routes
postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.post("/addPost", authenticateToken, uploadMultiple, addPost); // Use multer middleware to handle multiple file uploads
postRouter.put("/:id", updatePost);
postRouter.delete("/:id", deletePost);

export default postRouter;
