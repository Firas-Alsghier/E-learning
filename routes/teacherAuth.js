import express from 'express';
import Teacher from '../models/Teacher.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log('HEADERS:', req.headers);
  console.log('BODY:', req.body);
  try {
    // ✅ SAFE destructuring
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: teacher._id, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      teacher: {
        id: teacher._id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
      },
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
