import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, required: true },

  // ✅ Email verification fields
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },

  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  // ✅ Optional profile fields
  bio: { type: String, default: '' },
  headline: { type: String, default: '' },
  language: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },

  // ✅ Optional social links
  social: {
    website: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    x: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },

  privacySettings: {
    showProfile: { type: Boolean, default: false },
    showReviews: { type: Boolean, default: false },
    allowMessages: { type: Boolean, default: false },
  },

  notificationPreferences: {
    offers: {
      productUpdates: { type: Boolean, default: false },
      promotions: { type: Boolean, default: false },
    },
    learning: {
      stats: { type: Boolean, default: false },
      inspiration: { type: Boolean, default: false },
      courseRecs: { type: Boolean, default: false },
      lecturerNotifs: { type: Boolean, default: false },
    },
  },

  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
});

export default mongoose.model('User', userSchema);
