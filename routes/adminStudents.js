import express from 'express';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

// GET ALL STUDENTS (Admin + Search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let query = { role: 'student' };

    if (search) {
      query.$or = [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

      // If search looks like Mongo ID, allow search by _id
      if (search.length === 24) {
        query.$or.push({ _id: search });
      }
    }

    const students = await User.find(query).select('-password').sort({ createdAt: -1 });

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

// GET ALL ENROLLMENTS (Admin - Global + Search)
router.get('/enrollments', async (req, res) => {
  try {
    const { search } = req.query;

    let studentFilter = {};

    if (search) {
      const students = await User.find({
        role: 'student',
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          ...(search.length === 24 ? [{ _id: search }] : []),
        ],
      }).select('_id');

      const studentIds = students.map((s) => s._id);

      studentFilter = { student: { $in: studentIds } };
    }

    const enrollments = await Enrollment.find(studentFilter).populate('student', 'firstName lastName email').populate('course', 'title category').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
    });
  }
});

// GET STUDENT ENROLLMENT HISTORY
router.get('/:id/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.params.id,
    })
      .populate('course', 'title price category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment history',
    });
  }
});

export default router;
