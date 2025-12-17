import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import teacherAuthRoutes from './routes/teacherAuth.js';
import teacherArticlesRoutes from './routes/teacherArticles.js';

// import verifyEmailRoute from './routes/verifyEmail.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/teacher', teacherAuthRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/teacher/articles', teacherArticlesRoutes);

// app.use('/api', verifyEmailRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(3001, () => console.log('Server running on http://localhost:3001'));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
