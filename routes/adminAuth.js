// routes/adminAuth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js'; // ✅ use Admin model

const router = express.Router();

/**
 * ADMIN LOGIN
 * POST /api/admin/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Email from request:', email);
    // 1️⃣ Find admin
    const admin = await Admin.findOne({ email });
    console.log('Admin found:', admin);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 🚫 Blocked admin
    if (admin.isBlocked) {
      return res.status(403).json({ message: 'Admin account is blocked' });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3️⃣ Create JWT
    const token = jwt.sign(
      {
        id: admin._id,
        role: 'admin',
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4️⃣ Respond
    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
