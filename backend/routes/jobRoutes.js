import express from "express";
import {
  createJob,
  getRecruiterJobs,
  getJobById,
  toggleJobActive,
  scheduleInterview,
  getAllJobsForStudents,
  getMyApplications,
  deleteJob,
  getJobApplications
} from "../controllers/jobController.js";

import { protect, recruiterOnly, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, recruiterOnly, createJob);
router.get("/recruiter", protect, getRecruiterJobs);
router.get("/", protect, getAllJobsForStudents);
router.get("/:id", protect, getJobById);
router.put("/:id/toggle", protect, recruiterOnly, toggleJobActive);
router.put("/:jobId/schedule/:studentId", protect, recruiterOnly, scheduleInterview);

router.get("/my-applications", protect, getMyApplications);
router.get("/:jobId/applications", protect, recruiterOnly, getJobApplications);
router.delete("/:id", protect, recruiterOnly, deleteJob);

export default router;
