import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import Course from '../models/Course.js';

const router = express.Router();

// ❤️ TOGGLE WISHLIST
router.post('/wishlist/:courseId', userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { courseId } = req.params;

    console.log('👉 USER ID:', user._id);
    console.log('👉 COURSE ID:', courseId);
    console.log('👉 CURRENT WISHLIST:', user.wishlist);

    const index = user.wishlist.findIndex((id) => id.equals(courseId));

    console.log('👉 FOUND INDEX:', index);

    if (index !== -1) {
      console.log('❌ REMOVING COURSE');
      user.wishlist.splice(index, 1);
    } else {
      console.log('❤️ ADDING COURSE');
      user.wishlist.push(courseId);
    }

    await user.save();

    console.log('✅ SAVED WISHLIST:', user.wishlist);

    res.json({
      message: 'Wishlist updated',
      wishlist: user.wishlist.map((id) => id.toString()),
    });
  } catch (err) {
    console.error('Wishlist toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📥 GET USER WISHLIST
router.get('/wishlist', userAuth, async (req, res) => {
  try {
    const user = req.user;

    // 🔥 populate courses
    const courses = await Course.find({
      _id: { $in: user.wishlist },
    }).populate('teacher', 'firstName lastName');

    // 🔁 format like publicCourses
    const formattedCourses = courses.map((course) => ({
      id: course._id,
      title: course.title,
      slug: course.slug,
      image: course.coverImage,
      price: course.price,
      oldPrice: 0,
      category: course.category,
      duration: '2 Weeks',
      students: 0,
      level: course.level,
      lessons: course.sections?.length || 0,
      author: course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'Unknown Instructor',
      createdAt: course.createdAt,
      isWishlisted: true, // ✅ always true here
    }));

    res.json(formattedCourses);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
