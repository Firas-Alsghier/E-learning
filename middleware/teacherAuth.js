// middleware/teacherAuth.js
import jwt from 'jsonwebtoken';
import Teacher from '../models/Teacher.js';

export const teacherAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const teacher = await Teacher.findById(decoded.id).select('-password');

    if (!teacher) {
      return res.status(401).json({ message: 'Teacher not found' });
    }

    // ✅ FORCE LOGOUT CHECK (important)
    if (decoded.tokenVersion !== teacher.tokenVersion) {
      return res.status(401).json({ message: 'Session expired' });
    }

    // ✅ BLOCKED CHECK
    if (teacher.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    // ✅ APPROVAL CHECK
    if (!teacher.isApproved) {
      return res.status(403).json({ message: 'Account not approved yet' });
    }

    req.teacher = teacher;
    next();
  } catch (err) {
    console.error('Teacher auth error:', err.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
