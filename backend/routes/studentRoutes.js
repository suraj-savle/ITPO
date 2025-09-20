import express from "express";
import { protect, studentOnly } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";
import User from "../models/UserModel.js";

const router = express.Router();

router.get("/profile", protect, studentOnly, async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put(
  "/update-profile",
  protect,
  studentOnly,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profile", maxCount: 1 }
  ]), // handle resume upload
  updateProfile
);

export default router;
