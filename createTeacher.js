import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Teacher from './models/Teacher.js';

dotenv.config();

async function createTeacher() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash('0123456', 10);

    await Teacher.create({
      firstName: 'Test',
      lastName: 'Teacher',
      email: 'teacher@firas.com',
      password: hashedPassword,
      isApproved: true,
      // must be true to allow login
    });

    console.log('✅ Teacher created successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error creating teacher:', error);
    process.exit(1);
  }
}

createTeacher();
