import express from 'express';
import Cart from '../models/Cart.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import userAuth from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/checkout', userAuth, async (req, res) => {
  try {
    // We'll implement this in the next step.
    // Get user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: 'items.course',
      populate: {
        path: 'teacher',
      },
    });

    // Cart is empty
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: 'Your cart is empty',
      });
    }

    // Create purchases
    for (const item of cart.items) {
      const course = item.course;

      // Already purchased?
      const alreadyPurchased = await Purchase.findOne({
        user: req.user._id,
        course: course._id,
        paymentStatus: 'paid',
      });

      if (alreadyPurchased) {
        continue;
      }

      // Calculate expiration date
      const expiresAt = new Date();

      const accessDays = course.accessDuration > 0 ? course.accessDuration : 30;

      expiresAt.setDate(expiresAt.getDate() + accessDays);

      await Purchase.create({
        user: req.user._id,
        course: course._id,
        teacher: course.teacher._id,
        pricePaid: course.price,
        paymentStatus: 'paid',
        purchaseDate: new Date(),
        expiresAt,
      });
      course.studentsCount += 1;
      await course.save();
    }

    // Empty the cart
    cart.items = [];

    await cart.save();

    res.json({
      message: 'Checkout completed successfully.',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

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

    const before = cart.items.length;

    cart.items = cart.items.filter((item) => item.course.toString() !== courseId);

    if (before === cart.items.length) {
      return res.status(404).json({
        message: 'Course not found in cart',
      });
    }

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
