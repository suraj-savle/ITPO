import express from "express";
import { protect, adminOnly, studentOnly } from "../middleware/authMiddleware.js";
import { getAllPosts, createPost, getPostHistory, getAnnouncementsForUser } from "../controllers/postController.js";

const router = express.Router();

// Get all posts
router.get("/", protect, getAllPosts);

// Get announcements for current user
router.get("/announcements", protect, getAnnouncementsForUser);

// Test endpoint to get all posts
router.get("/test-all", protect, async (req, res) => {
  try {
    const Post = (await import('../models/PostModel.js')).default;
    const allPosts = await Post.find({});
    console.log('All posts in database:', allPosts);
    res.json({ count: allPosts.length, posts: allPosts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post (admin only)
router.post("/", protect, adminOnly, createPost);

// Get post history
router.get("/history", protect, adminOnly, getPostHistory);

// Update post (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const Post = (await import('../models/PostModel.js')).default;
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete post (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const Post = (await import('../models/PostModel.js')).default;
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get post applications (admin only)
router.get("/:id/applications", protect, adminOnly, async (req, res) => {
  try {
    const Post = (await import('../models/PostModel.js')).default;
    const post = await Post.findById(req.params.id).populate('applications.user', 'name email department cgpa');
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post.applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

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
