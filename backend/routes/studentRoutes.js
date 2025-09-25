import express from "express";
import { protect, studentOnly } from "../middleware/authMiddleware.js";
import { getStudentProfile, updateStudentProfile, uploadResume, upload, downloadResume } from "../controllers/studentController.js";
import User from "../models/UserModel.js";

const router = express.Router();

router.get("/profile", protect, studentOnly, getStudentProfile);

router.put("/update-profile", protect, studentOnly, updateStudentProfile);

router.post("/upload-resume", protect, studentOnly, upload.single('resume'), uploadResume);

router.get("/download-resume", protect, studentOnly, downloadResume);

export default router;
