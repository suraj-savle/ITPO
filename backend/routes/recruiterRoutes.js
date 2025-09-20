import express from "express";
import { protect, recruiterOnly } from "../middleware/authMiddleware.js"; // make sure these exist
import Student from "../models/StudentModel.js";    

const router = express.Router(); // ✅ Define router

// GET all students (for listing)
router.get("/students", protect, recruiterOnly, async (req, res) => {
  try {
    const students = await Student.find({}, {
      name: 1,
      email: 1,
      department: 1,
      year: 1,
      cgpa: 1,
      skills: 1,
      profileImage: 1,
      profileCompletion: 1
    }).sort({ profileCompletion: -1 }); // Optional: sort by profile completeness

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single student by ID
router.get("/student/:id", protect, recruiterOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
