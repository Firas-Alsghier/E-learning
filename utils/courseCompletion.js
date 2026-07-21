import Course from '../models/Course.js';
import Section from '../models/Section.js';
import UserProgress from '../models/UserProgress.js';

export async function getCourseCompletion(userId, courseId) {
  // Get the course
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error('Course not found');
  }

  // Get all sections of this course
  const sections = await Section.find({
    _id: { $in: course.sections },
  });

  // Count total lessons
  const totalLessons = sections.reduce((total, section) => {
    return total + section.lessons.length;
  }, 0);

  // Get student's progress
  console.log('Searching with:');
  console.log('userId:', userId);
  console.log('courseId:', courseId);
  const progress = await UserProgress.findOne({
    userId,
    courseId,
  });
  console.log('Progress document:', progress);
  const completedLessons = progress ? progress.completedLessons.length : 0;

  return {
    totalLessons,
    completedLessons,
    isCompleted: totalLessons > 0 && completedLessons === totalLessons,
  };
}
