// routes/teacherCourses.js
import express from 'express';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import { teacherAuth } from '../middleware/teacherAuth.js';
import { uploadCover } from '../middleware/upload.js';
import { videoUpload } from '../middleware/videoUpload.js';
import slugify from 'slugify';

const router = express.Router();

/**
 * ===============================
 * CREATE COURSE
 * ===============================
 */
router.post('/', teacherAuth, uploadCover.single('cover'), async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { title, description } = req.body;
    const coverImage = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}` : null;
    if (!title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ CREATE SLUG FROM TITLE
    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
      remove: /[*+~.()'"!:@]/g, // 👈 important
    });

    // ✅ MAKE SURE SLUG IS UNIQUE
    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course title already exists' });
    }
    const course = await Course.create({
      title,
      description,
      slug, // ✅ SAVE SLUG
      teacher: req.teacher._id,
      coverImage,
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
    const { courseId } = req.params;
    const { title, order } = req.body;

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

    const section = await Section.create({
      title,
      order: order ?? course.sections.length,
      course: course._id,
    });

    course.sections.push(section._id);
    await course.save();

    res.status(201).json(section);
  } catch (error) {
    console.error('Add section error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ===============================
 * ADD LESSON
 * ===============================
 */
router.post('/:sectionId/lessons', teacherAuth, async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, duration = 0, isFreePreview = false, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Lesson title is required' });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const course = await Course.findById(section.course);
    if (!course || course.teacher.toString() !== req.teacher.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const lesson = await Lesson.create({
      title,
      duration,
      isFreePreview,
      order: order ?? section.lessons.length,
      section: section._id,
    });

    section.lessons.push(lesson._id);
    await section.save();

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ===============================
 * UPLOAD COURSE COVER IMAGE
 * ===============================
 */
router.patch('/:courseId/cover', teacherAuth, uploadCover.single('cover'), async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      teacher: req.teacher._id,
    });

    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Save the full URL for easier frontend use
    course.coverImage = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    await course.save();

    res.json({ coverImage: course.coverImage });
  } catch (err) {
    console.error('Upload cover error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
