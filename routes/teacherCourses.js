import express from 'express';
import Course from '../models/Course.js';
import { teacherAuth } from '../middleware/teacherAuth.js';
import { uploadCover } from '../middleware/upload.js';
import { videoUpload } from '../middleware/videoUpload.js';

const router = express.Router();

/**
 * ===============================
 * CREATE COURSE (NO VIDEO HERE)
 * ===============================
 */
router.post('/', teacherAuth, uploadCover.single('cover'), async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const course = await Course.create({
      title,
      description,
      teacher: req.teacher._id,
      coverImage: req.file ? req.file.path.replace(/\\/g, '/') : null,
      sections: [],
      isPublished: false,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Failed to create course' });
  }
});

/**
 * ===============================
 * GET TEACHER COURSES
 * ===============================
 */
router.get('/', teacherAuth, async (req, res) => {
  try {
    const courses = await Course.find({
      teacher: req.teacher._id,
    }).sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

/**
 * ===============================
 * PUBLISH / UNPUBLISH COURSE
 * ===============================
 */
router.patch('/:courseId/publish', teacherAuth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      teacher: req.teacher._id,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({
      message: 'Course status updated',
      isPublished: course.isPublished,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course' });
  }
});

/**
 * ===============================
 * ADD SECTION
 * ===============================
 */
router.post('/:courseId/sections', teacherAuth, async (req, res) => {
  try {
    console.log('BODY:', req.body);

    const { title } = req.body;
    const { courseId } = req.params;

    if (!title) {
      return res.status(400).json({ message: 'Section title is required' });
    }

    const course = await Course.findOne({
      _id: courseId,
      teacher: req.teacher._id,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.sections.push({
      title,
      order: course.sections.length,
      lessons: [],
    });

    await course.save();

    res.json(course);
  } catch (err) {
    console.error('Add section error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ===============================
 * ADD LESSON
 * ===============================
 */
router.post('/:courseId/sections/:sectionId/lessons', teacherAuth, async (req, res) => {
  try {
    const { title, isFreePreview = false } = req.body;
    const { courseId, sectionId } = req.params;

    if (!title) {
      return res.status(400).json({ message: 'Lesson title is required' });
    }

    const course = await Course.findOne({
      _id: courseId,
      teacher: req.teacher._id,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.lessons.push({
      title,
      order: section.lessons.length,
      isFreePreview,
      videoUrl: null,
    });

    await course.save();

    res.json(course);
  } catch (err) {
    console.error('Add lesson error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ===============================
 * UPLOAD LESSON VIDEO
 * ===============================
 */
router.post('/:courseId/sections/:sectionId/lessons/:lessonId/video', teacherAuth, videoUpload.single('video'), async (req, res) => {
  try {
    console.log('FILE:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }

    const { courseId, sectionId, lessonId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      teacher: req.teacher._id,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const lesson = section.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    lesson.videoUrl = req.file.path.replace(/\\/g, '/');

    await course.save();

    res.json({
      message: 'Video uploaded successfully',
      videoUrl: lesson.videoUrl,
    });
  } catch (err) {
    console.error('Video upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
