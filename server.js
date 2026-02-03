// server.js
import dotenv from 'dotenv';
dotenv.config(); // 👈 MUST be before any other imports

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import teacherAuthRoutes from './routes/teacherAuth.js';
import teacherArticlesRoutes from './routes/teacherArticles.js';
import teacherCoursesRoutes from './routes/teacherCourses.js';
import publicCoursesRoutes from './routes/publicCourses.js';
import enrollmentRoutes from './routes/enrollments.js';

// import verifyEmailRoute from './routes/verifyEmail.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/teacher', teacherAuthRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/teacher/articles', teacherArticlesRoutes);
// app.use('/api/teacher', teacherCoursesRoutes);
app.use('/api/teacher/courses', teacherCoursesRoutes);
app.use('/api/courses', publicCoursesRoutes);
app.use('/api', enrollmentRoutes);

// app.use('/api', verifyEmailRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(3001, () => console.log('Server running on http://localhost:3001'));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
