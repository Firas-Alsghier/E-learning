import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    lastMessage: {
      type: String,
    },

    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/* 🔹 Performance Index */
conversationSchema.index({
  teacherId: 1,
  studentId: 1,
  courseId: 1,
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
