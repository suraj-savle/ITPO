import express from "express";
import { protect, recruiterOnly } from "../middleware/authMiddleware.js";
import {
  registerRecruiter,
  getRecruiterProfile,
  updateRecruiterProfile,
  createJobPosting,
  getRecruiterJobs,
  updateJobPosting,
  getJobApplications,
  updateApplicationStatus,
  getDashboardStats,
  getApplicationHistory,
  generateReport,
  upload
} from "../controllers/recruiterController.js";
import User from "../models/UserModel.js";
import Application from "../models/ApplicationModel.js";

const router = express.Router();

// Public routes
router.post("/register", upload.fields([
  { name: 'registrationCertificate', maxCount: 1 },
  { name: 'mouDocument', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), registerRecruiter);

// Protected routes
router.use(protect, recruiterOnly);

// Profile Management
router.get("/profile", getRecruiterProfile);
router.put("/profile", updateRecruiterProfile);

// Job Posting Management
router.post("/jobs", createJobPosting);
router.get("/jobs", getRecruiterJobs);
router.put("/jobs/:jobId", updateJobPosting);
router.get("/jobs/:jobId/applications", getJobApplications);

// Application Management
router.put("/applications/:applicationId", updateApplicationStatus);
router.get("/applications/history", getApplicationHistory);

// Dashboard & Analytics
router.get("/dashboard/stats", getDashboardStats);
router.get("/reports", generateReport);

// Get approved students for browsing
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      isApproved: true,
      profileCompletion: { $gte: 80 }
    })
    .select('name email phone department year cgpa skills profileImage bio projects experience certifications')
    .sort({ cgpa: -1, createdAt: -1 });

    res.json(students);
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/student/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/student-resume/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('resumeUrl name');
    if (!student) return res.status(404).json({ message: "Student not found" });
    
    if (!student.resumeUrl) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const path = await import('path');
    const fs = await import('fs');
    const filename = student.resumeUrl.split('/').pop();
    const filePath = path.default.join('uploads/resumes', filename);
    
    if (!fs.default.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }

    res.download(filePath, `${student.name.replace(/\s+/g, '_')}_Resume.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/application-history", async (req, res) => {
  try {
    const applications = await Application.find({ recruiter: req.user._id })
      .populate('student', 'name email department year')
      .populate('job', 'title company')
      .populate('mentor', 'name email')
      .sort({ updatedAt: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find({
      recruiter: req.user._id,
      status: { $in: ['pending recruiter review', 'interview scheduled', 'hired'] }
    })
    .populate('student', 'name email phone department year cgpa skills profileImage')
    .populate('job', 'title description location stipend skillsRequired duration')
    .populate('mentor', 'name email')
    .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('Get recruiter applications error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
