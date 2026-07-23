import express from 'express';
import Purchase from '../models/Purchase.js';
import userAuth from '../middleware/authMiddleware.js';
import Section from '../models/Section.js';
import UserProgress from '../models/UserProgress.js';
const router = express.Router();

router.get('/my-courses', userAuth, async (req, res) => {
  try {
    const purchases = await Purchase.find({
      user: req.user._id,
      paymentStatus: 'paid',
      expiresAt: {
        $gt: new Date(),
      },
    })
      .populate({
        path: 'course',
        populate: {
          path: 'teacher',
          select: 'firstName lastName',
        },
      })
      .sort({
        purchaseDate: -1,
      });
    const coursesWithProgress = await Promise.all(
      purchases.map(async (purchase) => {
        // Get all sections with their lessons
        const sections = await Section.find({
          _id: { $in: purchase.course.sections },
        });

        // Count total lessons
        const totalLessons = sections.reduce((total, section) => {
          return total + section.lessons.length;
        }, 0);

        // Get student's progress
        const progress = await UserProgress.findOne({
          userId: req.user._id,
          courseId: purchase.course._id,
        });

        const completedLessons = progress ? progress.completedLessons.length : 0;

        return {
          ...purchase.toObject(),
          totalLessons,
          completedLessons,
        };
      })
    );

    console.log('it comes from here:', JSON.stringify(coursesWithProgress, null, 2));

    res.json(coursesWithProgress);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

router.get('/check/:courseId', userAuth, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      user: req.user._id,
      course: req.params.courseId,
      paymentStatus: 'paid',
      expiresAt: {
        $gt: new Date(),
      },
    });

    res.json({
      purchased: !!purchase,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
});
export default router;
