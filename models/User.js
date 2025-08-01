import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: String,

  // ✅ Optional profile fields
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
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
});

export default mongoose.model('User', userSchema);
