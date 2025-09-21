// routes/authRoutes.js
import express from "express";
import { registerStudent, login, getProfile, updateProfile, checkEmail } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add check-email route
router.get("/check-email/:email", checkEmail);
router.post("/register-student", registerStudent);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/update-profile", protect, updateProfile);

export default router;