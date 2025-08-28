import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@/server/utils/db.ts';
import User from '@/models/User.js';

export default defineEventHandler(async (event) => {
  try {
    await connectToDB();

    const body = await readBody(event); // ✅ correct way to read body
    const token = getHeader(event, 'authorization')?.split(' ')[1];

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - No token provided',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Invalid token',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    // Track if we updated anything
    let updated = false;

    // Update email
    if (body.newEmail && body.newEmail !== user.email) {
      user.email = body.newEmail;
      updated = true;
    }

    // Update password
    if (body.newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(body.newPassword, salt);
      updated = true;
    }

    if (updated) {
      await user.save();
    }

    // ✅ Issue new JWT if account info was updated
    const newToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      success: true,
      message: 'Account updated successfully',
      token: newToken, // frontend should overwrite old token
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Server error',
    });
  }
});
