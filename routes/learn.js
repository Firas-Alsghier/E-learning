import express from 'express';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:courseId', userAuth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check that the user owns the course
    const purchase = await Purchase.findOne({
      user: req.user._id,
      course: courseId,
      paymentStatus: 'paid',
      expiresAt: { $gt: new Date() },
    });

    if (!purchase) {
      return res.status(403).json({
        message: 'You must purchase this course first.',
      });
    }

    const course = await Course.findById(courseId)
      .populate('teacher', 'firstName lastName social bio')
      .populate({
        path: 'sections',
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
        },
      });

    if (!course || !course.isPublished || course.status !== 'approved') {
      return res.status(404).json({
        message: 'Course not found.',
      });
    }

    res.json({
      id: course._id,
      teacherId: course.teacher?._id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      image: course.coverImage,
      category: course.category,
      level: course.level,
      sections: course.sections,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error.',
    });
  }
});

export default router;
