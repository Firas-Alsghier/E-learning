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

// Edit account (email or password)
// Edit account (email or password)
router.put('/edit-account', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { newEmail, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'كلمة المرور الحالية غير صحيحة' });
    }

    // Update email if provided
    if (newEmail) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
      }
      user.email = newEmail;
    }

    // Update password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    // ✅ Issue new JWT so the user stays logged in
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'تم تحديث الحساب بنجاح',
      token, // <-- send new token
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث الحساب' });
  }
});

router.put('/edit-privacy', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { showProfile, showReviews, allowMessages } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'privacySettings.showProfile': showProfile,
          'privacySettings.showReviews': showReviews,
          'privacySettings.allowMessages': allowMessages,
        },
      },
      { new: true }
    );

    res.json({ success: true, privacySettings: updatedUser.privacySettings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Close account (delete user)
// ✅ Delete user account
router.delete('/close-account', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/notifications', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { offers, learning } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, { notificationPreferences: { offers, learning } }, { new: true });

    res.json({ success: true, data: updatedUser.notificationPreferences });
  } catch (err) {
    console.error('Error updating notifications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
