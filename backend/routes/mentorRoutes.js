import express from "express";
import { 
  getMentees, 
  getMenteeApplications, 
  updatePlacementStatus, 
  getDashboard 
} from "../controllers/mentorController.js";
import { protect, mentorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, mentorOnly);

router.get("/dashboard", getDashboard);
router.get("/mentees", getMentees);
router.get("/mentee-applications/:studentId", getMenteeApplications);
router.put("/update-placement/:studentId", updatePlacementStatus);

export default router;