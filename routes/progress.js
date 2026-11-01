import express from 'express';
import UserProgress from '../models/UserProgress.js';
import userAuth from '../middleware/authMiddleware.js';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import Notification from '../models/Notification.js';
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

    // Get the course and all its lessons
    const course = await Course.findById(courseId).populate({
      path: 'sections',
      populate: {
        path: 'lessons',
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);

    const completedCount = new Set(progress.completedLessons.map((id) => id.toString())).size;

    // Check whether the entire course is completed
    if (totalLessons > 0 && completedCount >= totalLessons) {
      const existingNotification = await Notification.findOne({
        recipientId: userId,
        recipientRole: 'user',
        type: 'course_completion',
        link: `/courses/${course.slug}`,
      });

      if (!existingNotification && req.user.notificationPreferences?.courseCompletion !== false) {
        await Notification.create({
          recipientId: userId,
          recipientRole: 'user',
          type: 'course_completion',
          title: 'Congratulations! Course completed!',
          message: `You have successfully completed ${course.title}. Well done!`,
          link: `/courses/${course.slug}`,
        });
      }
    }

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
