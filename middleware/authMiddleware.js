import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'لم يتم العثور على التوكن' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ MATCH MONGOOSE STYLE
    req.user = {
      _id: decoded.id || decoded._id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'توكن غير صالح أو منتهي الصلاحية' });
  }
};

export default authMiddleware;
