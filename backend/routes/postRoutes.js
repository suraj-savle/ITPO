import express from "express";
import { protect, adminOnly, studentOnly } from "../middleware/authMiddleware.js";
import Post from "../models/PostModel.js";

const router = express.Router();

// Admin: Create a new post
router.post("/admin/posts", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all posts (students & admin)
router.get("/posts", protect, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Student: Apply to a post
router.post("/student/apply/:postId", protect, studentOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already applied" });
    }

    post.applicants.push(req.user._id);
    await post.save();

    res.json({ message: "Applied successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Get applicants for a post
router.get("/admin/applicants/:postId", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate("applicants", "name email department year skills");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post.applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
