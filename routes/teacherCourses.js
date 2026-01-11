// routes/teacherCourses.js
import express from 'express';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import { teacherAuth } from '../middleware/teacherAuth.js';
import { uploadCover } from '../middleware/upload.js';
import { videoUpload } from '../middleware/videoUpload.js';

const router = express.Router();

/**
 * ===============================
 * CREATE COURSE
 * ===============================
 */
router.post('/', teacherAuth, uploadCover.single('cover'), async (req, res) => {
  try {
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
 * ADD SECTION (REFERENCE-BASED)
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
 * ADD LESSON (REFERENCE-BASED)
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

router.post('/lessons/:lessonId/video', teacherAuth, videoUpload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }

    const { lessonId } = req.params;

    // 1. Find lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // 2. Find section
    const section = await Section.findById(lesson.section);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // 3. Find course & ownership check
    const course = await Course.findById(section.course);
    if (!course || course.teacher.toString() !== req.teacher.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // 4. Save video path
    lesson.videoUrl = req.file.path.replace(/\\/g, '/');
    await lesson.save();

    res.json({
      message: 'Video uploaded successfully',
      videoUrl: lesson.videoUrl,
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:courseId/curriculum', teacherAuth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Find course (ownership check)
    const course = await Course.findOne({
      _id: courseId,
      teacher: req.teacher._id,
    }).select('title description isPublished sections');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Populate sections → lessons
    const populatedCourse = await Course.findById(courseId)
      .populate({
        path: 'sections',
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
          select: 'title duration videoUrl isFreePreview order',
        },
      })
      .select('title description isPublished sections');

    res.json(populatedCourse);
  } catch (error) {
    console.error('Get curriculum error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
