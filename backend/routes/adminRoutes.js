import express from "express";
import { 
  getDashboard, 
  createUser, 
  getPendingStudents, 
  approveStudent, 
  rejectStudent, 
  getAllUsers,
  getMentors 
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);
router.post("/create-user", createUser);
router.get("/pending-students", getPendingStudents);
router.put("/approve-student/:id", approveStudent);
router.delete("/reject-student/:id", rejectStudent);
router.get("/users", getAllUsers);
router.get("/mentors", getMentors);

export default router;