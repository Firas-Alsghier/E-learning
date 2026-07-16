import express from 'express';
import Course from '../models/Course.js';
import CourseRating from '../models/CourseRating.js';
import Purchase from '../models/Purchase.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:courseId', userAuth, async (req, res) => {
  res.json({
    message: 'Route works',
  });
});

export default router;
