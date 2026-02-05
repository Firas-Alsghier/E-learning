// routes/adminTeachers.js
import express from 'express';
import Teacher from '../models/Teacher.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();
router.use(adminAuth); // 🔐 protects everything below

// GET pending teachers
router.get('/teachers/pending', async (req, res) => {
  try {
    const teachers = await Teacher.find({ isApproved: false }).select('-password').sort({ createdAt: -1 });

    res.status(200).json(teachers);
  } catch (error) {
    console.error('Fetch pending teachers error:', error);
    res.status(500).json({ message: 'Failed to fetch pending teachers' });
  }
});

export default router;
