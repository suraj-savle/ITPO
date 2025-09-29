import express from "express";
import { protect, studentOnly } from "../middleware/authMiddleware.js";
import { getStudentProfile, updateStudentProfile, uploadResume, upload, downloadResume, viewResume } from "../controllers/studentController.js";
import User from "../models/UserModel.js";

const router = express.Router();

router.get("/profile", protect, studentOnly, getStudentProfile);

router.put("/update-profile", protect, studentOnly, updateStudentProfile);

router.post("/upload-resume", protect, studentOnly, upload.single('resume'), uploadResume);

router.get("/download-resume", protect, studentOnly, downloadResume);

router.get("/view-resume", protect, studentOnly, viewResume);

export default router;
