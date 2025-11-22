import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'لم يتم العثور على التوكن' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧠 Make sure the structure always has user id and role
    req.user = {
      id: decoded.id || decoded._id, // in case token has _id not id
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'توكن غير صالح أو منتهي الصلاحية' });
  }
};

export default authMiddleware;
