// routes/publicCourses.js
import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

/**
 * ===============================
 * GET ALL PUBLISHED COURSES (PUBLIC)
 * ===============================
 */
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate('teacher', 'firstName lastName').sort({ createdAt: -1 });

    // 🔁 Shape data for frontend
    const formattedCourses = courses.map((course) => ({
      id: course._id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      image: course.coverImage, // 👈 FRONTEND EXPECTS image
      price: course.price,
      oldPrice: 0,
      category: course.category,
      duration: '3 Weeks', // temporary
      students: 0,
      level: course.level,
      lessons: course.sections?.length || 0,
      isWishlisted: false,
      author: course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'Unknown Instructor',
      createdAt: course.createdAt,
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.error('Public courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ===============================
 * GET SINGLE COURSE BY SLUG (PUBLIC)
 * ===============================
 */
router.get('/:slug', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=300');

    const course = await Course.findOne({
      slug: req.params.slug,
      isPublished: true,
    })
      .populate('teacher', 'firstName lastName social bio')
      .populate({
        path: 'sections',
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
        },
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    console.log(course);
    res.json({
      id: course._id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      image: course.coverImage,
      price: course.price,
      oldPrice: 0,
      faqs: course.faqs,
      bio: course.teacher.bio,
      category: course.category,
      duration: '2 Weeks',
      students: 0,
      level: course.level,
      social: course.teacher.social,
      lessons: course.sections?.length || 0,
      isWishlisted: false,
      author: course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'Unknown Instructor',
      sections: course.sections,
    });
  } catch (err) {
    console.error('Single course error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
