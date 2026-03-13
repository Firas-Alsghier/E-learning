import express from 'express';
import Message from '../models/Message.js';
// import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import { teacherAuth } from '../middleware/teacherAuth.js';
import userAuth from '../middleware/authMiddleware.js';
import multer from 'multer';
import mongoose from 'mongoose';

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
   SEND MESSAGE (Teacher → Student)
----------------------------- */
router.post('/', teacherAuth, upload.single('attachment'), async (req, res) => {
  try {
    const { receiver, text, courseId } = req.body;
    const finalReceiver = receiver;

    if (!finalReceiver || !courseId) {
      return res.status(400).json({ error: 'Receiver and Course ID are required' });
    }

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      courseId,
      teacherId: req.teacher._id,
      studentId: finalReceiver,
    });

    if (!conversation) {
      conversation = new Conversation({
        courseId,
        teacherId: req.teacher._id,
        studentId: finalReceiver,
        lastMessage: text,
        lastMessageAt: new Date(),
      });
      await conversation.save();
    }

    // Create message
    const message = new Message({
      conversationId: conversation._id,
      sender: req.teacher._id,
      senderType: 'Teacher',
      receiver: finalReceiver,
      receiverType: 'User',
      text,
      attachment: req.file ? req.file.filename : null,
    });
    await message.save();

    // Update conversation
    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    res.json({ conversation, message });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -----------------------------
   CONTACT TEACHER (Student → Teacher)
----------------------------- */
router.post('/contact-teacher', userAuth, upload.single('attachment'), async (req, res) => {
  try {
    const { teacherId, text, courseId } = req.body;

    if (!teacherId || !courseId) {
      return res.status(400).json({ error: 'Teacher ID and Course ID are required' });
    }

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      courseId,
      studentId: req.user._id,
      teacherId,
    });

    if (!conversation) {
      conversation = new Conversation({
        courseId,
        studentId: req.user._id,
        teacherId,
        lastMessage: text,
        lastMessageAt: new Date(),
      });
      await conversation.save();
    }

    // Create message
    const message = new Message({
      conversationId: conversation._id,
      sender: req.user._id,
      senderType: 'User',
      receiver: teacherId,
      receiverType: 'Teacher',
      text,
      attachment: req.file ? req.file.filename : null,
    });
    await message.save();

    // Update conversation
    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    res.json({ conversation, message });
  } catch (err) {
    console.error('Contact teacher error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -----------------------------
   GET TEACHER CONVERSATIONS (Inbox)
----------------------------- */
router.get('/conversations', teacherAuth, async (req, res) => {
  try {
    const teacherId = req.teacher._id;

    const conversations = await Conversation.find({ teacherId }).sort({ lastMessageAt: -1 }).populate('studentId', 'firstName lastName avatar');

    const mapped = conversations.map((conv) => ({
      id: conv.studentId._id,
      name: `${conv.studentId.firstName} ${conv.studentId.lastName}`,
      image: conv.studentId.avatar || '',
      lastMessage: conv.lastMessage,
      time: conv.lastMessageAt,
      unreadCount: 0, // can calculate later
      isOnline: false,
      conversationId: conv._id,
    }));

    res.json(mapped);
  } catch (err) {
    console.error('Load conversations error:', err);
    res.status(500).json({ message: 'Failed to load conversations' });
  }
});

/* -----------------------------
   GET MESSAGES OF A CONVERSATION
----------------------------- */
router.get('/:userId', teacherAuth, async (req, res) => {
  try {
    const myId = req.teacher._id;
    const otherUserId = req.params.userId;

    // Find the conversation
    const conversation = await Conversation.findOne({
      teacherId: myId,
      studentId: otherUserId,
    });

    if (!conversation) return res.json([]);

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

/* -----------------------------
   GET USER CONVERSATIONS (Student Inbox)
----------------------------- */
router.get('/user/conversations', userAuth, async (req, res) => {
  try {
    const studentId = req.user._id;

    const conversations = await Conversation.find({ studentId }).populate('teacherId', 'firstName lastName avatar').sort({ lastMessageAt: -1 });

    const result = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiver: studentId,
          isRead: false,
        });

        return {
          id: conv._id,
          teacherId: conv.teacherId._id,
          name: `${conv.teacherId.firstName} ${conv.teacherId.lastName}`,
          image: conv.teacherId.avatar || '',
          lastMessage: conv.lastMessage,
          time: conv.lastMessageAt,
          unreadCount,
          isOnline: false,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error('User conversations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -----------------------------
   GET MESSAGES (Student View)
----------------------------- */
router.get('/user/:teacherId', userAuth, async (req, res) => {
  try {
    const studentId = req.user._id;
    const teacherId = req.params.teacherId;

    const conversation = await Conversation.findOne({
      studentId,
      teacherId,
    });

    if (!conversation) return res.json([]);

    // 🔵 Mark messages as read
    await Message.updateMany(
      {
        conversationId: conversation._id,
        receiver: studentId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('User fetch messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
