import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET ALL STUDENTS (Admin)
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
    });
  }
});

// BLOCK STUDENT
router.patch('/:id/block', async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.isBlocked = true;
    await student.save();

    res.status(200).json({
      message: 'Student blocked successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to block student',
    });
  }
});

// DELETE STUDENT
router.delete('/:id', async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete student',
    });
  }
});

// GET BLOCKED STUDENTS
router.get('/blocked', async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      isBlocked: true,
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blocked students',
    });
  }
});

// GET REPORTED STUDENTS
router.get('/reported', async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      reports: { $exists: true, $not: { $size: 0 } },
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reported students',
    });
  }
});

// CLEAR REPORTS (Student)
router.patch('/:id/clear-reports', async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.reports = [];
    await student.save();

    res.status(200).json({
      message: 'Reports cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to clear reports',
    });
  }
});

export default router;
