import mongoose from 'mongoose';
import { type } from 'os';

const userSchema = new mongoose.Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, unique: true },
  password: { type: String, require: true },
  createdAt: { type: String, require: true },

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
});

export default mongoose.model('User', userSchema);
