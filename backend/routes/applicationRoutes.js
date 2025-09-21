// backend/routes/applicationRoutes.js
import express from "express";
import {
  applyToJob, getMyApplications, getMentorApplications,
  mentorDecision, getRecruiterApplications, recruiterDecision, withdrawApplication
} from "../controllers/applicationController.js";
import { protect, studentOnly, mentorOnly, recruiterOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student apply to a job
router.post("/:jobId/apply", protect, studentOnly, applyToJob);

// Student: list my applications
router.get("/me", protect, studentOnly, getMyApplications);

// Student: withdraw application
router.delete("/:id/withdraw", protect, studentOnly, withdrawApplication);

// Mentor: list apps assigned to me (pending)
router.get("/mentor", protect, mentorOnly, getMentorApplications);

// Mentor: approve/reject
router.put("/:id/mentor", protect, mentorOnly, mentorDecision);

// Recruiter: list applications for my jobs
router.get("/recruiter", protect, recruiterOnly, getRecruiterApplications);

// Recruiter: action on application (schedule/reject/hire)
router.put("/:id/recruiter", protect, recruiterOnly, recruiterDecision);

export default router;
