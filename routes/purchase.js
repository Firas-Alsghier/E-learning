import express from 'express';
import Purchase from '../models/Purchase.js';
import userAuth from '../middleware/authMiddleware.js';

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
    console.log(JSON.stringify(purchases, null, 2));
    res.json(purchases);
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
