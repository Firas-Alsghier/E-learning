import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/courses/:courseId/lessons/:lessonId/complete', userAuth, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled' });
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // calculate progress
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

    await enrollment.save();

    res.json({
      message: 'Lesson completed',
      progress: enrollment.progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

export default router;
