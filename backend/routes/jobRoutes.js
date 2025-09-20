import express from "express";
import {
  createJob,
  getRecruiterJobs,
  getJobById,
  toggleJobActive,
  scheduleInterview,
  applyToJob,
  getAllJobsForStudents,
  getMyApplications
} from "../controllers/jobController.js";
import { protect, recruiterOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/post-job", protect, recruiterOnly, createJob);
router.get("/get-post", protect, getRecruiterJobs);
router.get("/all-post", protect, getAllJobsForStudents);
router.get("/post/:id", protect, getJobById);
router.put("/:id/toggle", protect, recruiterOnly, toggleJobActive);
router.put("/:jobId/recruiter/:studentId/schedule", protect, recruiterOnly, scheduleInterview);
router.post("/post/:id/apply", protect, applyToJob);
router.get("/jobs/my-applications", protect, getMyApplications);

export default router;
