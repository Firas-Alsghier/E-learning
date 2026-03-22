import express from 'express';
import UserProgress from '../models/UserProgress.js';
import userAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/complete-lesson', userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, lessonId } = req.body;

    let progress = await UserProgress.findOne({
      userId,
      courseId,
    });

    if (!progress) {
      progress = new UserProgress({
        userId,
        courseId,
        completedLessons: [],
      });
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    await progress.save();

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving progress' });
  }
});

router.get('/:courseId', userAuth, async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  const progress = await UserProgress.findOne({
    userId,
    courseId,
  });

  res.json(progress || { completedLessons: [] });
});

// ❌ REMOVE lesson progress
router.post('/remove-lesson', userAuth, async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user._id; // from auth middleware
    const { courseId, lessonId } = req.body;

    const progress = await UserProgress.findOne({
      userId,
      courseId,
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    // 🔁 Remove lesson from completed array
    progress.completedLessons = progress.completedLessons.filter((id) => id.toString() !== lessonId);

    await progress.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Remove lesson error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
