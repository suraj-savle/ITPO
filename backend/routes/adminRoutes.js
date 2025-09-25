import express from "express";
import { 
  getDashboard, 
  createUser, 
  getPendingStudents, 
  approveStudent, 
  rejectStudent, 
  getAllUsers,
  getMentors,
  assignMentorToStudent 
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllPosts, createPost, deletePost, getPostHistory } from "../controllers/postController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);
router.post("/create-user", createUser);
router.get("/pending-students", getPendingStudents);
router.put("/approve-student/:id", approveStudent);
router.delete("/reject-student/:id", rejectStudent);
router.get("/users", getAllUsers);
router.get("/mentors", getMentors);
router.put("/assign-mentor", assignMentorToStudent);
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
router.delete("/posts/:id", deletePost);
router.get("/post-history", getPostHistory);

export default router;