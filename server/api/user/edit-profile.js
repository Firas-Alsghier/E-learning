// server/api/user/edit-profile.ts
import { connectToDB } from '@/server/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  if (event.method !== 'PUT') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  // ✅ Connect to MongoDB
  await connectToDB();

  const body = await readBody(event);
  const authHeader = getHeader(event, 'Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }

  const userId = decoded.id;

  const updatedUser = await User.findByIdAndUpdate(userId, { $set: body }, { new: true });

  if (!updatedUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return {
    message: 'User updated successfully',
    user: updatedUser,
  };
});
