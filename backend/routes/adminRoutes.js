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

// Post routes
router.get("/posts", getAllPosts);
router.post("/posts", createPost);
router.delete("/posts/:id", deletePost);
router.get("/post-history", getPostHistory);

export default router;