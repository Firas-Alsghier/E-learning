import express from 'express';
import Notification from '../models/Notification.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// GET USER NOTIFICATIONS
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user._id,
      recipientRole: 'user',
    }).sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      recipientId: req.user._id,
      recipientRole: 'user',
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('FETCH NOTIFICATIONS ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// MARK ONE NOTIFICATION AS READ
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipientId: req.user._id,
        recipientRole: 'user',
      },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('MARK NOTIFICATION READ ERROR:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// MARK ALL NOTIFICATIONS AS READ
router.patch('/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipientId: req.user._id,
        recipientRole: 'user',
        isRead: false,
      },
      { isRead: true },
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('MARK ALL NOTIFICATIONS READ ERROR:', error);
    res.status(500).json({ message: 'Failed to update notifications' });
  }
});

export default router;
