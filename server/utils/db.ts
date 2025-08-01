import mongoose from 'mongoose';

export const connectToDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return;

    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error('MongoDB URI is missing in .env file');

    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};
