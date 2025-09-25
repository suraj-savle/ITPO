import express from "express";
import { 
  getMentees, 
  getMenteeApplications, 
  updatePlacementStatus, 
  getDashboard,
  getPendingApplications,
  getProgressTracking,
  testMentor 
} from "../controllers/mentorController.js";
import { protect, mentorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Test route without mentorOnly middleware
router.get("/test-simple", protect, async (req, res) => {
  try {
    const User = (await import('../models/UserModel.js')).default;
    const mentees = await User.find({ 
      role: "student", 
      assignedMentor: req.user._id,
      status: "active"
    }).select("-password");
    
    res.json({ 
      success: true, 
      user: { id: req.user._id, role: req.user.role },
      mentees 
    });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

router.use(protect, mentorOnly);

router.get("/test", testMentor);
router.get("/dashboard", getDashboard);
router.get("/mentees", getMentees);
router.get("/pending-applications", getPendingApplications);
router.get("/progress-tracking", getProgressTracking);
router.get("/student-profile/:studentId", async (req, res) => {
  try {
    const User = (await import('../models/UserModel.js')).default;
    const student = await User.findOne({ 
      _id: req.params.studentId, 
      assignedMentor: req.user._id 
    }).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found or not your mentee' });
    }
    
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/student-resume/:studentId", async (req, res) => {
  try {
    const User = (await import('../models/UserModel.js')).default;
    const student = await User.findOne({ 
      _id: req.params.studentId, 
      assignedMentor: req.user._id 
    }).select('resumeUrl name');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found or not your mentee' });
    }
    
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
    res.status(500).json({ message: err.message });
  }
});

router.get("/application-history", async (req, res) => {
  try {
    const Application = (await import('../models/ApplicationModel.js')).default;
    const applications = await Application.find({ mentor: req.user._id })
      .populate('student', 'name email department year')
      .populate('job', 'title company')
      .sort({ updatedAt: -1 });
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/mentee-applications/:studentId", getMenteeApplications);
router.put("/update-placement/:studentId", updatePlacementStatus);

export default router;