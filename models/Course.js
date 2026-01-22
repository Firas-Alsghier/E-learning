// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ['Basic', 'Intermediate', 'Advanced', 'Expert'],
      required: true,
    },

    faqs: [
      {
        question: String,
        answer: String,
      },
    ],

    price: {
      type: Number,
      default: 0,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
