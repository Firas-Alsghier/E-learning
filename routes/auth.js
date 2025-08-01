import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Format date as (YYYY, MMM, DDD)
    const createdAt = new Date().toDateString(); // e.g., Mon Jul 22 2025

    // Save user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt,
    });

    await newUser.save();

    // Create JWT token
    const payload = {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'البريد الإلكتروني غير مسجل' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
    }

    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// Edit Profile
router.put('/edit-profile', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, headline, bio, language, avatarUrl, website, facebook, instagram, linkedin, tiktok, x, youtube } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          lastName,
          headline,
          bio,
          language,
          avatarUrl,
          social: {
            website,
            facebook,
            instagram,
            linkedin,
            tiktok,
            x,
            youtube,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: 'تم تحديث الملف بنجاح',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء التحديث' });
  }
});

export default router;
