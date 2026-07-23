import express from 'express';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import { getCourseCompletion } from '../utils/courseCompletion.js';
import userAuth from '../middleware/authMiddleware.js';
import { generateCertificate } from '../utils/generateCertificate.js';

const router = express.Router();

router.post('/:courseId', userAuth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check that the course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found.',
      });
    }

    // Check completion
    const completion = await getCourseCompletion(req.user._id, courseId);

    if (!completion.isCompleted) {
      return res.status(403).json({
        message: 'Complete the course before getting a certificate.',
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: req.user._id,
      course: courseId,
    }).populate('user');

    if (existingCertificate) {
      return generateCertificate(res, existingCertificate, `${existingCertificate.user.firstName} ${existingCertificate.user.lastName}`, course.title);
    }

    // Generate a unique certificate number
    const certificateNumber = `CERT-${Date.now()}`;

    // Save certificate
    const certificate = await Certificate.create({
      user: req.user._id,
      course: courseId,
      certificateNumber,
    });

    await certificate.populate('user');

    // Return it
    return generateCertificate(res, certificate, `${certificate.user.firstName} ${certificate.user.lastName}`, course.title);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error.',
    });
  }
});

export default router;
