// middleware/adminAuth.js
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js'; // ✅ use Admin model

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default adminAuth;
