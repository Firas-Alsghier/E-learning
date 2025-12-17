import express from 'express';
import TeacherArticle from '../models/TeacherArticle.js';
import verifyTeacher from '../middleware/verifyTeacher.js';

const router = express.Router();

/** Create article */
router.post('/', verifyTeacher, async (req, res) => {
  const { title, content } = req.body;

  const article = await TeacherArticle.create({
    teacherId: req.teacherId,
    title,
    content,
  });

  res.json(article);
});

/** Get teacher articles */
router.get('/', verifyTeacher, async (req, res) => {
  const articles = await TeacherArticle.find({ teacherId: req.teacherId });
  res.json(articles);
});

/** Delete article */
router.delete('/:id', verifyTeacher, async (req, res) => {
  await TeacherArticle.deleteOne({
    _id: req.params.id,
    teacherId: req.teacherId,
  });

  res.json({ success: true });
});

export default router;
