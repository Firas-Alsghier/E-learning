import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    recipientRole: {
      type: String,
      enum: ['user', 'teacher'],
      required: true,
    },

    type: {
      type: String,
      enum: ['teacher_notification', 'course_purchase', 'welcome', 'course_completion', 'new_message', 'new_course_purchase'],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientId: 1, recipientRole: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
