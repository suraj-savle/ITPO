import express from "express";
import { protect, adminOnly, studentOnly } from "../middleware/authMiddleware.js";
import { getAllPosts, createPost, getPostHistory } from "../controllers/postController.js";

const router = express.Router();

// Get all posts
router.get("/", protect, getAllPosts);

// Create a new post (admin only)
router.post("/", protect, adminOnly, createPost);

// Get post history
router.get("/history", protect, adminOnly, getPostHistory);

// Student: Apply to a post
router.post("/apply/:postId", protect, studentOnly, async (req, res) => {
  try {
    const Post = (await import('../models/PostModel.js')).default;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if already applied
    const alreadyApplied = post.applications.some(
      app => app.user.toString() === req.user._id.toString()
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied" });
    }

    post.applications.push({
      user: req.user._id,
      status: "pending",
      appliedOn: new Date()
    });
    await post.save();

    res.json({ message: "Applied successfully" });
  } catch (err) {
    console.error("Apply to post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
