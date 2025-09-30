import express from "express";
import {
  createJob,
  getRecruiterJobs,
  getJobById,
  updateJob,
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
router.get("/recruiter", protect, recruiterOnly, getRecruiterJobs);
router.get("/my-applications", protect, studentOnly, getMyApplications);
router.get("/", protect, getAllJobsForStudents);

// Support both PUT and PATCH for toggle - BEFORE generic :id routes
router.put("/:id/toggle", protect, recruiterOnly, toggleJobActive);
router.patch("/:id/toggle", protect, recruiterOnly, toggleJobActive);

router.get("/:id", protect, getJobById);
router.put("/:id", protect, recruiterOnly, updateJob);
router.put("/:jobId/schedule/:studentId", protect, recruiterOnly, scheduleInterview);
router.get("/:jobId/applications", protect, recruiterOnly, getJobApplications);
router.delete("/:id", protect, recruiterOnly, deleteJob);

export default router;
