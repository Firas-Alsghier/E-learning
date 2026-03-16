import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    completedLessons: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('UserProgress', userProgressSchema);
