// routes/adminCourses.js
import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

// GET ALL COURSES (Admin)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'firstName lastName email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
    });
  }
});

// UPDATE COURSE ACCESS DURATION (Admin)
router.patch('/:id/duration', async (req, res) => {
  try {
    const { accessDuration } = req.body;

    if (!Number.isInteger(accessDuration) || accessDuration < 1 || accessDuration > 3650) {
      return res.status(400).json({
        message: 'Duration must be between 1 and 3650 days',
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    course.accessDuration = accessDuration;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course duration updated successfully',
      accessDuration: course.accessDuration,
    });
  } catch (error) {
    console.error('UPDATE COURSE DURATION ERROR:', error);

    res.status(500).json({
      message: 'Failed to update course duration',
    });
  }
});

// BLOCK COURSE
router.patch('/:id/block', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // ✅ Block + hide from public
    course.isBlocked = true;
    course.isPublished = false;
    course.status = 'draft'; // optional but cleaner state

    await course.save();

    res.status(200).json({
      message: 'Course blocked successfully',
    });
  } catch (error) {
    console.error('BLOCK ERROR:', error);
    res.status(500).json({ message: 'Failed to block course' });
  }
});

// DELETE COURSE (Hard Delete)
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course deleted permanently',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course' });
  }
});

// GET PENDING COURSES (Admin)
router.get('/pending', async (req, res) => {
  try {
    const courses = await Course.find({
      status: 'pending',
    })
      .populate('teacher', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending courses',
    });
  }
});

router.patch('/:id/approve', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // ✅ Approve logic
    course.status = 'approved';
    course.isPublished = true;

    await course.save();

    res.status(200).json({
      message: 'Course approved and published',
    });
  } catch (error) {
    console.error('APPROVE ERROR:', error); // 👈 ADD THIS

    res.status(500).json({ message: 'Failed to approve course' });
  }
});

router.patch('/:id/reject', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // ❌ Reject logic
    course.status = 'rejected';
    course.isPublished = false;

    await course.save();

    res.status(200).json({
      message: 'Course rejected',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject course' });
  }
});

// UNBLOCK COURSE
router.patch('/:id/unblock', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.isBlocked = false;
    course.isPublished = true;
    course.status = 'approved';
    await course.save();

    res.status(200).json({
      message: 'Course unblocked successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unblock course' });
  }
});

// GET REPORTED COURSES (Admin)
router.get('/reported', async (req, res) => {
  try {
    const courses = await Course.find({
      reports: { $exists: true, $not: { $size: 0 } },
    })
      .populate('teacher', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reported courses',
    });
  }
});

// CLEAR REPORTS (Admin)
router.patch('/:id/clear-reports', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.reports = []; // remove all reports
    await course.save();

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
