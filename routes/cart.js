import express from 'express';
import Cart from '../models/Cart.js';
import Course from '../models/Course.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:courseId', userAuth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // Prevent duplicate courses
    const alreadyInCart = cart.items.some((item) => item.course.toString() === courseId);

    if (alreadyInCart) {
      return res.status(400).json({
        message: 'Course already in cart',
      });
    }

    // Add course
    cart.items.push({
      course: courseId,
    });

    await cart.save();

    res.json({
      message: 'Course added to cart',
      cart,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

router.get('/', userAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: 'items.course',
      populate: {
        path: 'teacher',
        select: 'firstName lastName',
      },
    });

    if (!cart) {
      return res.json({
        items: [],
      });
    }

    res.json(cart);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Remove course from cart
router.delete('/:courseId', userAuth, async (req, res) => {
  try {
    const { courseId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item.course.toString() !== courseId);

    await cart.save();

    res.json({
      message: 'Course removed from cart',
      cart,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

export default router;
