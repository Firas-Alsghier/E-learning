import express from 'express';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// 📂 Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder to save files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
  fileFilter(req, file, cb) {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'));
    }
  },
});

// 📝 Create a new blog (teachers only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'غير مصرح لك بإنشاء المقالات' });
    }

    const { title, content, image } = req.body;

    const blog = new Blog({
      title,
      content,
      image,
      author: req.user.id,
      createdAt: new Date(),
    });

    await blog.save();

    res.status(201).json({ message: 'تم إنشاء المقال بنجاح ✅', blog });
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المقال' });
  }
});

// 📚 Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'firstName lastName avatarUrl');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المقالات' });
  }
});

// ✏️ Edit blog (only owner teacher)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'المقال غير موجود' });

    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'غير مصرح لك بتعديل هذا المقال' });

    const { title, content, image } = req.body;
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image || blog.image;

    await blog.save();

    res.json({ message: 'تم تحديث المقال بنجاح ✅', blog });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء تعديل المقال' });
  }
});

// ❌ Delete blog (only owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'المقال غير موجود' });

    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'غير مصرح لك بحذف هذا المقال' });

    await blog.deleteOne();
    res.json({ message: 'تم حذف المقال بنجاح 🗑️' });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء حذف المقال' });
  }
});

// 📖 Get blogs created by the logged-in teacher
router.get('/my-blogs', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'غير مصرح لك بعرض المقالات الخاصة' });
    }

    const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المقالات الخاصة بك' });
  }
});
export default router;
