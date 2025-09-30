import express from 'express';
import { protect, studentOnly, mentorOnly } from '../middleware/authMiddleware.js';
import { getJobRecommendations, getJobRecommendationsForStudent } from '../controllers/recommendationController.js';

const router = express.Router();

// Student gets their own recommendations
router.get('/jobs', protect, studentOnly, getJobRecommendations);

// Mentor gets recommendations for a specific student
router.get('/student/:studentId/jobs', protect, mentorOnly, getJobRecommendationsForStudent);

export default router;