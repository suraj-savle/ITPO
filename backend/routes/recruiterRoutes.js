import express from "express";
import { protect, recruiterOnly } from "../middleware/authMiddleware.js";
import User from "../models/UserModel.js";    

const router = express.Router(); // ✅ Define router

// GET mentor-approved students with their applications
router.get("/students", protect, recruiterOnly, async (req, res) => {
  try {
    const Application = (await import('../models/ApplicationModel.js')).default;
    
    // Find applications for this recruiter's jobs that are mentor-approved
    const applications = await Application.find({
      recruiter: req.user._id,
      status: { $in: ['pending recruiter review', 'interview scheduled', 'hired'] }
    })
    .populate('student', 'name email phone department year cgpa skills profileImage profileCompletion')
    .populate('job', 'title description location stipend skillsRequired duration')
    .sort({ createdAt: -1 });

    // Group applications by student
    const studentsMap = new Map();
    applications.forEach(app => {
      const studentId = app.student._id.toString();
      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          ...app.student.toObject(),
          applications: []
        });
      }
      studentsMap.get(studentId).applications.push({
        _id: app._id,
        job: app.job,
        status: app.status,
        appliedAt: app.createdAt,
        interviewDate: app.interviewDate
      });
    });

    const studentsWithApplications = Array.from(studentsMap.values());
    res.json(studentsWithApplications);
  } catch (err) {
    console.error('Get approved students error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single student by ID
router.get("/student/:id", protect, recruiterOnly, async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET applications for recruiter's jobs (mentor-approved)
router.get("/applications", protect, recruiterOnly, async (req, res) => {
  try {
    const Application = (await import('../models/ApplicationModel.js')).default;
    
    // Get applications for this recruiter's jobs that are mentor-approved
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
