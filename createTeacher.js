import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'admin@example.com';
    const password = '35715900f'; // change later

    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log('❌ Admin already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log('✅ Admin created successfully');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);

    process.exit();
  } catch (err) {
    console.error('Admin seed error:', err);
    process.exit(1);
  }
};

createAdmin();
