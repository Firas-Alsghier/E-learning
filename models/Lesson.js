// models/Lesson.js
import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
      default: null,
    },

    duration: {
      type: Number, // seconds
      default: 0,
    },

    isFreePreview: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },

    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  },
  { timestamps: true }
);

// optimized fetching
lessonSchema.index({ section: 1, order: 1 });

export default mongoose.model('Lesson', lessonSchema);
