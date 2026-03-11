// routes/messages.js
import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
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

/* -----------------------------
   SEND MESSAGE
----------------------------- */

router.post('/', teacherAuth, upload.single('attachment'), async (req, res) => {
  try {
    const { receiver, receiverId, text } = req.body;

    const finalReceiver = receiver || receiverId;

    if (!finalReceiver) {
      return res.status(400).json({ error: 'Receiver is required' });
    }

    const message = new Message({
      sender: req.teacher._id,
      senderType: 'Teacher',
      receiver: finalReceiver,
      receiverType: 'User',
      text,
      attachment: req.file ? req.file.filename : null,
    });

    await message.save();

    res.json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/contact-teacher', userAuth, upload.single('attachment'), async (req, res) => {
  try {
    const { teacherId, text, courseId } = req.body;

    if (!teacherId) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }

    const message = new Message({
      sender: req.user._id,
      senderType: 'User',
      receiver: teacherId,
      receiverType: 'Teacher',
      text,
      course: courseId,
      attachment: req.file ? req.file.filename : null,
    });

    await message.save();

    res.json(message);
  } catch (err) {
    console.error('Contact teacher error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET teacher conversations
router.get('/conversations', teacherAuth, async (req, res) => {
  try {
    const teacherId = req.teacher._id;

    const messages = await Message.find({
      $or: [
        { sender: teacherId, senderType: 'Teacher' },
        { receiver: teacherId, receiverType: 'Teacher' },
      ],
    }).sort({ createdAt: -1 });

    const conversationsMap = new Map();

    for (const msg of messages) {
      // determine the student id
      let studentId;

      if (msg.senderType === 'User') {
        studentId = msg.sender;
      } else {
        studentId = msg.receiver;
      }

      if (!conversationsMap.has(studentId)) {
        const student = await User.findById(studentId).select('firstName lastName avatar');

        if (!student) continue;

        conversationsMap.set(studentId.toString(), {
          id: studentId,
          name: `${student.firstName} ${student.lastName}`,
          image: student.avatar || '',
          lastMessage: msg.text,
          time: msg.createdAt,
          unreadCount: 0,
          isOnline: false,
        });
      }
    }

    const conversations = Array.from(conversationsMap.values());

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load conversations' });
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

export default router;
