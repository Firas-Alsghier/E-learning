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
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'غير مصرح لك بإنشاء المقالات' });
    }

    const { title, content, isPublished } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'الرجاء إدخال العنوان والمحتوى' });
    }

    // Parse tags if they exist
    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch {
        tags = [];
      }
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const blog = new Blog({
      title,
      content,
      tags,
      coverImage: imageUrl,
      author: req.user.id,
      isPublished: isPublished === 'true', // handle both boolean & string
    });

    await blog.save();

    res.status(201).json({
      message: blog.isPublished ? 'تم نشر المقال بنجاح ✅' : 'تم حفظ المقال كمسودة 📝',
      blog,
    });
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المقال' });
  }
});

// 📚 Get all published blogs (for students/public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).populate('author', 'firstName lastName avatarUrl').sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المقالات' });
  }
});

// Update publish status (publish or unpublish a draft)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    const userId = req.user.id; // from your auth middleware

    // Find blog by ID
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'لم يتم العثور على المقال.' });

    // Ensure the current user owns this blog
    if (blog.author.toString() !== userId) return res.status(403).json({ message: 'ليس لديك صلاحية لتعديل هذا المقال.' });

    // Update publish status only
    blog.isPublished = isPublished;
    blog.updatedAt = new Date();

    await blog.save();

    res.status(200).json({ message: isPublished ? 'تم نشر المقال!' : 'تم حفظ المقال كمسودة!', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث حالة المقال.' });
  }
});

// 🟢 Publish a draft
router.patch('/:id/publish', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'المقال غير موجود' });

    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'غير مصرح لك بنشر هذا المقال' });

    blog.isPublished = true;
    await blog.save();

    res.json({ message: 'تم نشر المقال بنجاح ✅', blog });
  } catch (err) {
    console.error('Error publishing blog:', err);
    res.status(500).json({ message: 'حدث خطأ أثناء نشر المقال' });
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

// GET /api/blogs?page=1&limit=5
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const total = await Blog.countDocuments({ isPublished: true });
  const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'firstName lastName');

  res.json({
    blogs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

export default router;
