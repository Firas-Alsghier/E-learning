import express from 'express';
import Purchase from '../models/Purchase.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-courses', userAuth, async (req, res) => {
  try {
    const purchases = await Purchase.find({
      user: req.user._id,
      paymentStatus: 'paid',
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

    res.json(purchases);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

export default router;
