import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/courses/:courseId/enroll', userAuth, async (req, res) => {
  try {
    console.log('REQ.USER:', req.user);
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to enroll' });
  }
});

export default router;
