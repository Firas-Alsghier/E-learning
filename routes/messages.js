// routes/messages.js
import express from 'express';
import Message from '../models/Message.js';
// import User from '../models/User.js'; /* 'User' is declared but its value is never read. */
import { teacherAuth } from '../middleware/teacherAuth.js';
import multer from 'multer';
const router = express.Router();

/* -----------------------------
   File Upload Config
----------------------------- */

const storage = multer.diskStorage({
  destination: 'uploads/messages',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// GET teacher conversations
router.get('/conversations', teacherAuth, async (req, res) => {
  try {
    const teacherId = req.teacher.id;

    const messages = await Message.find({
      teacher: teacherId,
    })
      .populate('student', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const student = msg.student;
      const studentId = student._id.toString();

      if (!conversationsMap.has(studentId)) {
        conversationsMap.set(studentId, {
          id: studentId,
          name: `${student.firstName} ${student.lastName}`,
          image: student.avatar || '',
          lastMessage: msg.text,
          time: msg.createdAt,
          unreadCount: 0,
          isOnline: false,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load conversations' });
  }
});

/* -----------------------------
   SEND MESSAGE
----------------------------- */

router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const { sender, senderType, receiver, receiverType, text } = req.body;

    const attachment = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}` : null;

    const message = await Message.create({
      sender,
      senderType,
      receiver,
      receiverType,
      text,
      attachment,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

router.get('/:userId', teacherAuth, async (req, res) => {
  try {
    const myId = req.teacher._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// GET messages with a specific student
router.get('/:studentId', teacherAuth, async (req, res) => {
  try {
    const teacherId = req.teacher.id;
    const { studentId } = req.params;

    const messages = await Message.find({
      teacher: teacherId,
      student: studentId,
    }).sort({ createdAt: 1 });

    const formatted = messages.map((msg) => ({
      id: msg._id,
      text: msg.text,
      isUser: msg.sender === 'teacher',
      time: msg.createdAt,
      status: 'read',
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load messages' });
  }
});
export default router;
