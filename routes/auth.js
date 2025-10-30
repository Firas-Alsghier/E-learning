import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';
import authMiddleware from '../middleware/authMiddleware.js';

// import { Router } from 'lucide-vue-next';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      role: req.body.role || 'student',
      isVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // expires in 24h
    });

    await user.save();

    // Create email verification link
    const verifyLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

    // Send verification email
    const emailContent = `
      <h2>مرحباً ${firstName} 👋</h2>
      <p>من فضلك اضغط على الرابط أدناه لتفعيل حسابك:</p>
      <a href="${verifyLink}" target="_blank"
         style="background:#4F46E5;color:white;padding:10px 20px;
         border-radius:8px;text-decoration:none;">
         تفعيل الحساب
      </a>
      <p>الرابط صالح لمدة 24 ساعة فقط.</p>
    `;
    await sendEmail(email, 'تأكيد البريد الإلكتروني', emailContent);

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح. تحقق من بريدك الإلكتروني لتأكيد الحساب.',
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب.' });
  }
});
// ✅ VERIFY EMAIL ROUTE
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'رمز التفعيل غير صالح أو منتهي الصلاحية.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Auto-login after verification
    const tokenJWT = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const frontendURL = `http://localhost:3000/verify-success?token=${jwtToken}`;
    return res.redirect(frontendURL);
  } catch (error) {
    console.error('❌ Verify error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تفعيل الحساب.' });
  }
});

// ✅ Resend Verification Email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified.' });

    // 🔑 Generate a new token
    const token = crypto.randomBytes(20).toString('hex');
    user.verificationToken = token;
    user.verificationTokenExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // ✉️ Send the email again
    const link = `http://localhost:3000/verify-email/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <h2>Verify your email</h2>
        <p>Please click the link below to verify your account:</p>
        <a href="${link}" target="_blank">${link}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.json({ message: 'Verification email resent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'المستخدم غير موجود.' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'كلمة السر غير صحيحة.' });

    // Check if verified
    if (!user.isVerified) return res.status(400).json({ message: 'يرجى تفعيل الحساب عبر البريد الإلكتروني.' });

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح ✅',
      user,
      token,
      role: user.role, // ✅
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول.' });
  }
});

// Edit Profile
router.put('/edit-profile', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, headline, bio, language, avatarUrl, website, facebook, instagram, linkedin, tiktok, x, youtube } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          lastName,
          headline,
          bio,
          language,
          avatarUrl,
          social: {
            website,
            facebook,
            instagram,
            linkedin,
            tiktok,
            x,
            youtube,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: 'تم تحديث الملف بنجاح',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء التحديث' });
  }
});

// Edit account (email or password)
// Edit account (email or password)
router.put('/edit-account', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { newEmail, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'كلمة المرور الحالية غير صحيحة' });
    }

    // Update email if provided
    if (newEmail) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
      }
      user.email = newEmail;
    }

    // Update password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    // ✅ Issue new JWT so the user stays logged in
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'تم تحديث الحساب بنجاح',
      token, // <-- send new token
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث الحساب' });
  }
});

// inside auth.js
router.put('/edit-privacy', authMiddleware, async (req, res) => {
  try {
    const { showProfile, showReviews, allowMessages } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'privacySettings.showProfile': showProfile,
          'privacySettings.showReviews': showReviews,
          'privacySettings.allowMessages': allowMessages,
        },
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: '✅ Privacy updated',
      privacySettings: user.privacySettings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Close account (delete user)
// ✅ Delete user account
router.delete('/close-account', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/notifications', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { offers, learning } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, { notificationPreferences: { offers, learning } }, { new: true });

    res.json({ success: true, data: updatedUser.notificationPreferences });
  } catch (err) {
    console.error('Error updating notifications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // fetch all documents
    res.json(users); // return to frontend
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      headline: user.headline,
      bio: user.bio,
      language: user.language,
      avatarUrl: user.avatarUrl,
      social: user.social || {},
      notificationPreferences: user.notificationPreferences || {},
      privacySettings: user.privacySettings || {}, // 👈 add this line
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/change-email', authMiddleware, async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    const user = await User.findById(req.user.id);

    // check password first
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'كلمة المرور غير صحيحة' });
    }

    user.email = newEmail;
    await user.save();

    res.json({ msg: 'تم تحديث البريد الإلكتروني', email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'خطأ في الخادم' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'رمز التحقق مفقود' });
    }

    // Find user with valid token (not expired)
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'رمز التحقق غير صالح أو منتهي الصلاحية' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'تم تفعيل حسابك بنجاح 🎉' });
  } catch (error) {
    console.error('❌ Error verifying email:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء التحقق من الحساب' });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) return res.status(400).json({ message: 'Token not found' });

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and update verification status
    const user = await User.findByIdAndUpdate(decoded.id, { verified: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// ✅ Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'لا يوجد مستخدم بهذا البريد الإلكتروني.' });
    }

    // 1️⃣ Generate reset token (random string)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2️⃣ Hash it before saving to DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 3️⃣ Save hashed token + expiry time (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // 4️⃣ Create reset link with NON-hashed token
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // 5️⃣ Send email
    const htmlContent = `
      <h2>إعادة تعيين كلمة المرور</h2>
      <p>انقر على الزر أدناه لإعادة تعيين كلمة المرور الخاصة بك:</p>
      <a href="${resetLink}" 
         style="display:inline-block; padding:10px 20px; background-color:#4f46e5; color:white; text-decoration:none; border-radius:6px;">
         إعادة تعيين كلمة المرور
      </a>
      <p>سينتهي هذا الرابط خلال ساعة واحدة.</p>
    `;

    await sendEmail(user.email, 'إعادة تعيين كلمة المرور', htmlContent);
    res.json({ message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' });
  } catch (error) {
    console.error('❌ Error in forgot-password:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إرسال رابط إعادة التعيين.' });
  }
});

// ✅ Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'رمز التحقق أو كلمة المرور مفقودة.' });
    }

    // 1️⃣ Hash the token from the URL (same way we saved it)
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2️⃣ Find user with valid token and non-expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'رمز التحقق غير صالح أو منتهي الصلاحية.' });
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // 4️⃣ Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'تم تغيير كلمة المرور بنجاح!' });
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إعادة تعيين كلمة المرور.' });
  }
});

export default router;
