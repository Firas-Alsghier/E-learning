import express from 'express';
import Course from '../models/Course.js';
import CourseRating from '../models/CourseRating.js';
import Purchase from '../models/Purchase.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:courseId', userAuth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check that the course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // Check that the user purchased the course
    console.log('User:', req.user._id);
    console.log('Course:', courseId);
    const purchase = await Purchase.findOne({
      user: req.user._id,
      course: courseId,
      paymentStatus: 'paid',
    });
    console.log('Purchase:', purchase);
    if (!purchase) {
      return res.status(403).json({
        message: 'You must purchase this course before rating it.',
      });
    }

    const { rating } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5.',
      });
    }

    // Check if the user already rated this course
    let courseRating = await CourseRating.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (courseRating) {
      // Update existing rating
      courseRating.rating = rating;
      await courseRating.save();
    } else {
      // Create a new rating
      courseRating = await CourseRating.create({
        user: req.user._id,
        course: courseId,
        rating,
      });
    }

    // Get all ratings for this course
    const ratings = await CourseRating.find({ course: courseId });

    // Calculate average
    const ratingsCount = ratings.length;

    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratingsCount;

    // Update the course
    await Course.findByIdAndUpdate(courseId, {
      averageRating,
      ratingsCount,
    });

    res.json({
      message: 'Rating saved successfully.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

export default router;
