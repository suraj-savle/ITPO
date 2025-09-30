import express from "express";
import { 
  getDashboard, 
  createUser, 
  getPendingStudents, 
  approveStudent, 
  rejectStudent, 
  getAllUsers,
  getMentors,
  assignMentorToStudent,
  assignMentor,
  getUserActivities,
  getUsersStatus 
} from "../controllers/adminController.js";
import {
  getPendingUsers,
  approveUser,
  getPendingJobs,
  reviewJob,
  getDashboardStats,
  getApplicationStats,
  getApplicationsOverview,
  sendBulkNotification,
  generateReport
} from "../controllers/placementController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllPosts, createPost, updatePost, deletePost, getPostHistory } from "../controllers/postController.js";

const router = express.Router();

router.use(protect, adminOnly);

// Enhanced placement cell routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/users/pending", getPendingUsers);
router.put("/users/:userId/approve", approveUser);
router.get("/jobs/pending", getPendingJobs);
router.put("/jobs/:jobId/review", reviewJob);
router.get("/applications/stats", getApplicationStats);
router.get("/applications/overview", getApplicationsOverview);
router.post("/notifications/bulk", sendBulkNotification);
router.get("/reports", generateReport);

// Legacy routes
router.get("/dashboard", getDashboard);
router.post("/create-user", createUser);
router.get("/pending-students", getPendingStudents);
router.put("/approve-student/:id", approveStudent);
router.delete("/reject-student/:id", rejectStudent);
router.get("/users", getAllUsers);
router.get("/mentors", getMentors);
router.put("/assign-mentor", assignMentorToStudent);
router.put("/assign-mentor/:studentId", assignMentor);
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const User = (await import('../models/UserModel.js')).default;
    const Application = (await import('../models/ApplicationModel.js')).default;
    const Job = (await import('../models/JobModel.js')).default;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete related data based on user role
    if (user.role === 'student') {
      await Application.deleteMany({ student: user._id });
      await User.updateMany({ assignedMentor: user._id }, { $unset: { assignedMentor: 1 } });
    } else if (user.role === 'mentor') {
      await User.updateMany({ assignedMentor: user._id }, { $unset: { assignedMentor: 1 } });
      await Application.deleteMany({ mentor: user._id });
    } else if (user.role === 'recruiter') {
      await Job.deleteMany({ recruiter: user._id });
      await Application.deleteMany({ recruiter: user._id });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post routes
router.get("/posts", getAllPosts);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);
router.get("/post-history", getPostHistory);

// Activity monitoring routes
router.get("/activities", getUserActivities);
router.get("/users-status", getUsersStatus);
router.post("/seed-activities", async (req, res) => {
  try {
    const User = (await import('../models/UserModel.js')).default;
    const users = await User.find({ role: { $in: ['student', 'mentor', 'recruiter'] } });
    
    const activities = [
      'Updated profile', 'Applied to job', 'Logged in', 'Approved application',
      'Rejected application', 'Posted new job', 'Scheduled interview', 'Hired candidate'
    ];
    
    for (const user of users) {
      const numActivities = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < numActivities; i++) {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const randomDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        user.activityLog.push({ action: randomActivity, date: randomDate });
      }
      user.lastLogin = new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000);
      await user.save();
    }
    
    res.json({ message: 'Sample activities seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;