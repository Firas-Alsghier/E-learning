// Section.js
import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Section', sectionSchema);
