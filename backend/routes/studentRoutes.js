import express from "express";
import { protect, studentOnly } from "../middleware/authMiddleware.js";
import { getStudentProfile, updateStudentProfile } from "../controllers/studentController.js";
import User from "../models/UserModel.js";

const router = express.Router();

router.get("/profile", protect, studentOnly, getStudentProfile);

router.put("/update-profile", protect, studentOnly, updateStudentProfile);

export default router;
