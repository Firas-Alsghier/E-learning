import jwt from 'jsonwebtoken';
import Teacher from '../models/Teacher.js';

export const teacherAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const teacher = await Teacher.findById(decoded.id).select('-password');

    if (!teacher) {
      return res.status(401).json({ message: 'Teacher not found' });
    }

    req.teacher = teacher; // 🔥 attach teacher to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
