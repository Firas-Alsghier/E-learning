// models/Teacher.js
import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    // -------------------
    // BASIC INFO
    // -------------------
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // -------------------
    // ROLE & STATUS
    // -------------------
    role: {
      type: String,
      default: 'teacher',
      immutable: true,
    },

    isApproved: {
      type: Boolean,
      default: false, // 🔥 admin must approve
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // -------------------
    // PROFILE (future)
    // -------------------
    headline: String,
    bio: String,
    avatar: String,
    language: {
      type: String,
      enum: ['en', 'ar'],
      default: 'en',
    },

    // -------------------
    // RELATIONS (future)
    // -------------------
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],

    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],

    // -------------------
    // META
    // -------------------
    lastLogin: Date,
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model('Teacher', teacherSchema);
