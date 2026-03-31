// routes/teacherCourses.js
import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary.js'; // Uncomment your cloudinary import
// import { fileURLToPath } from 'url';
import express from 'express';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Lesson from '../models/Lesson.js';
import LevelCheck from '../models/LevelCheck.js';
import { teacherAuth } from '../middleware/teacherAuth.js';
import { uploadCover } from '../middleware/upload.js';
// import { videoUpload } from '../middleware/videoUpload.js';
import slugify from 'slugify';
// import cloudinary from '../config/cloudinary.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const router = express.Router();

router.patch('/lessons/:lessonId/video-url', teacherAuth, async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ message: 'Video URL is required' });
    }

    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    lesson.videoUrl = videoUrl;
    await lesson.save();

    res.json({ message: 'Video URL saved successfully' });
  } catch (err) {
    console.error('Save video URL error:', err);
    res.status(500).json({ message: 'Failed to save video URL' });
  }
});
/**
 * CREATE COURSE
 * POST /api/teacher/courses
 */
router.post('/', teacherAuth, uploadCover.single('cover'), async (req, res) => {
  try {
    const { title, description, category, level, faqs, levelCheck } = req.body;

    const coverImage = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}` : null;

    if (!title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const slug = slugify(title, { lower: true, strict: true, trim: true, remove: /[*+~.()'"!:@]/g });

    const existingCourse = await Course.findOne({ slug, teacher: req.teacher._id });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course title already exists' });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      slug,
      teacher: req.teacher._id,
      coverImage,
      faqs: faqs || [],
      levelCheck: {
        enabled: levelCheck?.enabled || false,
        questions: levelCheck?.questions || [],
      },
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
 * UPDATE COURSE PRICE
 * PATCH /api/teacher/courses/:courseId/price
 */
router.patch('/:courseId/price', teacherAuth, async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate({ _id: req.params.courseId, teacher: req.teacher._id }, { price: req.body.price }, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update price' });
  }
});

/**
 * PUBLISH / UNPUBLISH
 * PATCH /api/teacher/courses/:courseId/publish
 */
router.patch('/:courseId/publish', teacherAuth, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, teacher: req.teacher._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({ message: 'Course status updated', isPublished: course.isPublished });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course' });
  }
});

/**
 * UPLOAD COURSE COVER IMAGE
 * PATCH /api/teacher/courses/:courseId/cover
 */
router.patch('/:courseId/cover', teacherAuth, uploadCover.single('cover'), async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, teacher: req.teacher._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.coverImage = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    await course.save();

    res.json({ coverImage: course.coverImage });
  } catch (err) {
    console.error('Upload cover error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET ALL TEACHER COURSES
 * GET /api/teacher/courses
 */
router.get('/', teacherAuth, async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.teacher._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

/**
 * GET FULL COURSE (WITH SECTIONS + LESSONS)
 * GET /api/teacher/courses/:courseId/full
 */
router.get('/:courseId/full', teacherAuth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      teacher: req.teacher._id,
    }).populate({
      path: 'sections',
      options: { sort: { order: 1 } },
      populate: { path: 'lessons', options: { sort: { order: 1 } } },
    });

    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * UPDATE COURSE INFO (Step 1)
 * PATCH /api/teacher/courses/:courseId
 */
router.patch('/:courseId', teacherAuth, async (req, res) => {
  try {
    const { title, description, category, level, faqs, levelCheck } = req.body;

    const course = await Course.findOne({
      _id: req.params.courseId,
      teacher: req.teacher._id,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // --- Update fields ---
    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.category = category ?? course.category;
    course.level = level ?? course.level;
    course.faqs = faqs ?? course.faqs;

    // --- Level Check ---
    course.levelCheck = {
      enabled: levelCheck?.enabled || false,
      questions: levelCheck?.questions || [],
    };

    await course.save();

    res.json({ message: 'Course updated successfully', course });
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ message: 'Failed to update course' });
  }
});

/**
 * ADD SECTION
 * POST /api/teacher/courses/:courseId/sections
 */
router.post('/:courseId/sections', teacherAuth, async (req, res) => {
  try {
    const { title, order } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Section title is required' });

    const course = await Course.findOne({ _id: req.params.courseId, teacher: req.teacher._id });
    if (!course) return res.status(404).json({ message: 'Course not found or not yours' });

    const section = await Section.create({
      title: title.trim(),
      order: order ?? course.sections.length,
      course: course._id,
    });

    course.sections.push(section._id);
    await course.save();

    res.status(201).json(section);
  } catch (error) {
    console.error('Add section error:', error);
    res.status(500).json({ message: 'Failed to add section' });
  }
});

/**
 * ADD LESSON
 * POST /api/teacher/courses/:sectionId/lessons
 */
router.post('/:sectionId/lessons', teacherAuth, async (req, res) => {
  try {
    const { title, duration = 0, isFreePreview = false, order } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Lesson title is required' });

    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const course = await Course.findOne({ _id: section.course, teacher: req.teacher._id });
    if (!course) return res.status(403).json({ message: 'Not allowed' });

    const lesson = await Lesson.create({
      title: title.trim(),
      duration,
      isFreePreview,
      order: order ?? section.lessons.length,
      section: section._id,
      course: course._id,
    });

    section.lessons.push(lesson._id);
    await section.save();

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({ message: 'Failed to add lesson' });
  }
});

/**
 * ADD / UPDATE LEVEL CHECK
 * PUT /api/teacher/courses/:courseId/level-check
 */
router.put('/:courseId/level-check', teacherAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { questions, isEnabled } = req.body;

    const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let levelCheck = await LevelCheck.findOne({ courseId });
    if (!levelCheck) {
      levelCheck = new LevelCheck({ courseId, questions: questions || [], isEnabled: isEnabled || false });
    } else {
      levelCheck.questions = questions || [];
      levelCheck.isEnabled = isEnabled || false;
    }

    await levelCheck.save();
    res.json(levelCheck);
  } catch (err) {
    console.error('Level check error:', err);
    res.status(500).json({ message: 'Failed to save level check' });
  }
});

router.patch('/sections/:sectionId', teacherAuth, async (req, res) => {
  try {
    const { title } = req.body;

    const section = await Section.findById(req.params.sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.title = title;
    await section.save();

    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update section' });
  }
});

router.patch('/lessons/:lessonId', teacherAuth, async (req, res) => {
  try {
    const { title } = req.body;

    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    lesson.title = title;
    await lesson.save();

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update lesson' });
  }
});

router.patch('/:courseId/curriculum', teacherAuth, async (req, res) => {
  try {
    const { sections } = req.body;

    // 1. Validate course ownership
    const course = await Course.findOne({
      _id: req.params.courseId,
      teacher: req.teacher._id,
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Update sections + lessons
    for (const sectionData of sections) {
      const section = await Section.findById(sectionData._id);
      if (!section) continue;

      section.title = sectionData.title;
      await section.save();

      for (const lessonData of sectionData.lessons) {
        const lesson = await Lesson.findById(lessonData._id);
        if (!lesson) continue;

        lesson.title = lessonData.title;
        await lesson.save();
      }
    }

    res.json({ message: 'Curriculum updated successfully' });
  } catch (err) {
    console.error('Curriculum update error:', err);
    res.status(500).json({ message: 'Failed to update curriculum' });
  }
});

router.delete('/sections/:sectionId', teacherAuth, async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    // remove from course
    await Course.updateOne({ _id: section.course }, { $pull: { sections: section._id } });

    // delete lessons inside
    await Lesson.deleteMany({ section: section._id });

    await section.deleteOne();

    res.json({ message: 'Section deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete section' });
  }
});

router.delete('/lessons/:lessonId', teacherAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    await lesson.deleteOne();

    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete lesson' });
  }
});

router.delete('/sections/:sectionId', teacherAuth, async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    await Lesson.deleteMany({ section: section._id });

    await Course.findByIdAndUpdate(section.course, {
      $pull: { sections: section._id },
    });

    await section.deleteOne();

    res.json({ message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete section' });
  }
});

router.delete('/lessons/:lessonId', teacherAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    await Section.findByIdAndUpdate(lesson.section, {
      $pull: { lessons: lesson._id },
    });

    await lesson.deleteOne();

    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete lesson' });
  }
});

// --- Helper function to get Cloudinary Public ID from a URL ---
const getCloudinaryId = (url) => {
  if (!url || !url.includes('cloudinary')) return null;
  // Splits the URL to get everything after "/upload/v123456/"
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;

  const pathAfterUpload = parts[1].split('/');
  pathAfterUpload.shift(); // Remove the version number (e.g., v1712345)

  const publicIdWithExt = pathAfterUpload.join('/');
  return publicIdWithExt.split('.')[0]; // Remove extension like .mp4
};

/**
 * DELETE FULL COURSE
 * DELETE /api/teacher/courses/:courseId
 */
router.delete('/:courseId', teacherAuth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Find the course and check if it belongs to this teacher
    const course = await Course.findOne({ _id: courseId, teacher: req.teacher._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // 2. Get all lessons to find video URLs
    const lessons = await Lesson.find({ course: courseId });

    // 3. Delete Videos from Cloudinary
    for (const lesson of lessons) {
      if (lesson.videoUrl) {
        const publicId = getCloudinaryId(lesson.videoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }
      }
    }

    // 4. Delete Cover Image
    if (course.coverImage) {
      if (course.coverImage.includes('cloudinary')) {
        // If stored on Cloudinary
        const coverId = getCloudinaryId(course.coverImage);
        if (coverId) await cloudinary.uploader.destroy(coverId);
      } else {
        // If stored locally on your server
        const filename = course.coverImage.split('/').pop();
        const localPath = path.join('uploads/covers', filename); // Adjust path to your folder
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      }
    }

    // 5. Delete from MongoDB (Order matters!)
    await Lesson.deleteMany({ course: courseId }); // Delete lessons
    await Section.deleteMany({ course: courseId }); // Delete sections
    await course.deleteOne(); // Delete the main course

    res.json({ message: 'Course and all assets deleted successfully! 🗑️' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete everything' });
  }
});

export default router;
