// routes/teacherAuth.js
import express from 'express';
import Teacher from '../models/Teacher.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { teacherAuth } from '../middleware/teacherAuth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, country, gender, birthDate } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      country,
      gender,
      birthDate,
      isApproved: false, // ⛔ admin must approve
    });

    res.status(201).json({
      message: 'تم إنشاء حساب المعلم. يرجى انتظار موافقة الإدارة.',
    });
  } catch (error) {
    console.error('Teacher signup error:', error);
    res.status(500).json({ message: 'خطأ أثناء إنشاء الحساب' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find teacher
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 🚫 BLOCK if not approved
    if (!teacher.isApproved) {
      return res.status(403).json({
        message: 'Your account is not approved yet. Please wait for admin approval.',
      });
    }

    // 🚫 BLOCK if admin blocked the account
    if (teacher.isBlocked) {
      return res.status(403).json({
        message: 'Your account has been blocked. Please contact support.',
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Create token
    const token = jwt.sign({ id: teacher._id, role: 'teacher', email: teacher.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      teacher: {
        id: teacher._id,
        email: teacher.email,
        role: 'teacher',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current teacher
router.get('/me', teacherAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({
      id: teacher._id,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      headline: teacher.headline,
      bio: teacher.bio,
      language: teacher.language,
      avatar: teacher.avatar,
      isApproved: teacher.isApproved,
      isBlocked: teacher.isBlocked,
      role: 'teacher',
      createdAt: teacher.createdAt,
    });
  } catch (err) {
    console.error('Teacher /me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit Profile for teacher
router.put('/edit-profile', teacherAuth, async (req, res) => {
  const teacherId = req.teacher.id;

  const { firstName, lastName, headline, phone, bio, language, avatar } = req.body;

  try {
    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (headline !== undefined) updateData.headline = headline;
    if (bio !== undefined) updateData.bio = bio;
    if (language !== undefined) updateData.language = language;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (phone !== undefined) updateData.phone = phone;

    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, { $set: updateData }, { new: true });

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error('Update teacher profile error:', error);
    res.status(500).json({
      message: 'An error occurred while updating profile',
    });
  }
});

export default router;
