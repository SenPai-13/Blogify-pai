import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getComments,
  getMyPosts,
} from "../controllers/postController";

import { protect } from "../middleware/authMiddleware";
const router = Router();

// Create a new post (author only)
router.post("/", protect, createPost);

// Get all posts (public)
router.get("/", getPosts);

// Get user posts
router.get("/mine", protect, getMyPosts);

// Get single post by ID (public)
router.get("/:id", getPostById);

// Update post (author only)
router.put("/:id", protect, updatePost);

// Delete post (author only)
router.delete("/:id", protect, deletePost);

// Like/unlike a post
router.post("/:id/like", protect, toggleLike);

// 🔹 Add a comment (plural)
router.post("/:id/comments", protect, addComment);

// 🔹 Get all comments for a post (plural)
router.get("/:id/comments", getComments);

// 🔹 Delete a comment (plural)
router.delete("/:id/comments/:commentId", protect, deleteComment);

export default router;
