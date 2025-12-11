import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/post.model";

// Create Post
export const createPost = async (req: Request, res: Response) => {
  try {
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    const { heading, content } = req.body;
    if (!heading || !content) {
      return res
        .status(400)
        .json({ message: "Heading and content are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const post = new Post({
      heading,
      content,
      author: req.user.id, // ✅ matches schema
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error creating post" });
  }
};

// Get all posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .populate("comments.user", "username email"); // <-- IMPORTANT

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// Get single post
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email")
      .populate("comments.user", "username email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error getting post" });
  }
};

// Update post
export const updatePost = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author can edit
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    post.heading = req.body.heading || post.heading;
    post.content = req.body.content || post.content;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
};

// Delete post
export const deletePost = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author can delete
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
};

// Likes & Comments

export const toggleLike = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Check if user already liked the post
    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Remove like
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add like
      post.likes.push(userId);
    }

    await post.save();

    // 🔹 Return consistent shape (full post + derived fields)
    res.json({
      _id: post._id,
      heading: post.heading,
      content: post.content,
      author: post.author,
      comments: post.comments,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likes: post.likes,
      likesCount: post.likes.length,
      liked: !alreadyLiked, // true if user just liked, false if unliked
    });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Error toggling like" });
  }
};

// Add a comment
export const addComment = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: new mongoose.Types.ObjectId(req.user.id),
      text: req.body.text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    post.comments.push(comment as any);
    await post.save();

    await post.populate("comments.user", "username email");
    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Error adding comment" });
  }
};

// Get all comments for a post
export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id; // ✅ Correct param name

    const post = await Post.findById(postId).populate(
      "comments.user",
      "username email"
    ); // ⭐ Populate usernames

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ comments: post.comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find(
      (c: any) => c._id.toString() === req.params.commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment author or post author can delete
    if (
      comment.user.toString() !== req.user.id &&
      post.author.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    post.comments = post.comments.filter(
      (c: any) => c._id.toString() !== req.params.commentId
    );
    await post.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Error deleting comment" });
  }
};

// Get my posts
export const getMyPosts = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const posts = await Post.find({ author: req.user.id }).populate(
      "author",
      "username email"
    );
    res.json(posts);
  } catch (err) {
    console.error("Error fetching my posts:", err);
    res.status(500).json({ message: "Error fetching my posts" });
  }
};
