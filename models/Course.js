// Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    coverImage: {
      type: String,
    },

    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],

    category: {
      type: String,
    },

    price: {
      type: Number,
      default: 0,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },

    level: {
      type: String,
      enum: ['All levels', 'Basic', 'Intermediate', 'Advanced', 'Expert'],
    },

    levelCheck: {
      questions: [
        {
          question: String,
          answers: [
            {
              text: String,
              isCorrect: Boolean,
            },
          ],
        },
      ],
      enabled: {
        type: Boolean,
        default: false,
      },
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

    reports: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

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
