import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Student from "../models/StudentModel.js";

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
