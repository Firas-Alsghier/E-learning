// routes/adminTeachers.js
import express from 'express';
import Teacher from '../models/Teacher.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// 🔒 Protect ALL admin teacher routes
// router.use(adminAuth);

// ==============================
// GET pending teachers
// ==============================
router.get('/teachers/pending', async (req, res) => {
  try {
    const teachers = await Teacher.find({ isApproved: false }).select('-password').sort({ createdAt: -1 });

    res.status(200).json(teachers);
  } catch (error) {
    console.error('Fetch pending teachers error:', error);
    res.status(500).json({ message: 'Failed to fetch pending teachers' });
  }
});

// ==============================
// APPROVE teacher
// ==============================
router.patch('/teachers/:id/approve', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, { isApproved: true, isBlocked: false }, { new: true });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({
      message: 'Teacher approved successfully',
      teacherId: teacher._id,
    });
  } catch (error) {
    console.error('Approve teacher error:', error);
    res.status(500).json({ message: 'Failed to approve teacher' });
  }
});

// ==============================
// REJECT teacher (delete)
// ==============================
router.delete('/teachers/:id/reject', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({
      message: 'Teacher rejected and removed',
    });
  } catch (error) {
    console.error('Reject teacher error:', error);
    res.status(500).json({ message: 'Failed to reject teacher' });
  }
});

// ==============================
// GET approved teachers
// ==============================
router.get('/teachers/approved', async (req, res) => {
  try {
    const teachers = await Teacher.find({
      isApproved: true,
      isBlocked: false,
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(teachers);
  } catch (error) {
    console.error('Fetch approved teachers error:', error);
    res.status(500).json({ message: 'Failed to fetch approved teachers' });
  }
});

// ==============================
// BLOCK teacher
// ==============================
router.patch('/teachers/:id/block', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.isBlocked = true;
    await teacher.save();

    res.status(200).json({
      message: 'Teacher blocked successfully',
      teacherId: teacher._id,
    });
  } catch (error) {
    console.error('Block teacher error:', error);
    res.status(500).json({ message: 'Failed to block teacher' });
  }
});

// ==============================
// GET BLOCKED TEACHERS
// ==============================
router.get('/teachers/blocked', adminAuth, async (req, res) => {
  try {
    const teachers = await Teacher.find({
      isBlocked: true,
      isRejected: false,
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(teachers);
  } catch (error) {
    console.error('Fetch blocked teachers error:', error);
    res.status(500).json({ message: 'Failed to fetch blocked teachers' });
  }
});

// ==============================
// UNBLOCK teacher
// ==============================
router.patch('/teachers/:id/unblock', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.isBlocked = false;
    await teacher.save();

    res.status(200).json({
      message: 'Teacher unblocked successfully',
      teacherId: teacher._id,
    });
  } catch (error) {
    console.error('Unblock teacher error:', error);
    res.status(500).json({ message: 'Failed to unblock teacher' });
  }
});

// ==============================
// REVOKE teacher approval
// ==============================
router.patch('/teachers/:id/revoke', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.isApproved = false;
    teacher.isBlocked = false;
    await teacher.save();

    res.status(200).json({
      message: 'Teacher approval revoked successfully',
      teacherId: teacher._id,
    });
  } catch (error) {
    console.error('Revoke teacher error:', error);
    res.status(500).json({ message: 'Failed to revoke teacher' });
  }
});

// GET REJECTED TEACHERS
router.get('/teachers/rejected', adminAuth, async (req, res) => {
  try {
    const rejectedTeachers = await Teacher.find({ isRejected: true }).select('-password').sort({ createdAt: -1 });

    res.json(rejectedTeachers);
  } catch (error) {
    console.error('Get rejected teachers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// REJECT TEACHER (Soft Delete)
router.patch('/teachers/:id/reject', adminAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.isRejected = true;
    teacher.isApproved = false;
    teacher.isBlocked = false;

    await teacher.save();

    res.json({ message: 'Teacher rejected successfully (soft delete)' });
  } catch (error) {
    console.error('Reject teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// RESTORE REJECTED TEACHER
router.patch('/teachers/:id/restore', adminAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.isRejected = false;
    teacher.isApproved = false; // goes back to pending
    teacher.isBlocked = false;

    await teacher.save();

    res.json({ message: 'Teacher restored successfully' });
  } catch (error) {
    console.error('Restore teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/teachers/:id/hard-delete', adminAuth, async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
