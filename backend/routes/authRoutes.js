// routes/authRoutes.js
import express from "express";
import { registerStudent, loginStudent } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);

export default router;
