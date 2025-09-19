import express from "express";
import { 
  getJobs, 
  createJob, 
  applyForJob, 
  getMyApplications, 
  getRecruiterJobs 
} from "../controllers/jobController.js";
import { protect, studentOnly, recruiterOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getJobs);
router.post("/", protect, recruiterOnly, createJob);
router.post("/:id/apply", protect, studentOnly, applyForJob);
router.get("/my-applications", protect, studentOnly, getMyApplications);
router.get("/recruiter/my-jobs", protect, recruiterOnly, getRecruiterJobs);

export default router;