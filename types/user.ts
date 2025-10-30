export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  headline?: string;
  language?: string;
  createdAt?: string;

  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
    youtube?: string;
  };

  notificationPreferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
  };

  // ✅ Add this
  privacySettings?: {
    showProfile?: boolean;
    showReviews?: boolean;
    allowMessages?: boolean;
  };
  role?: 'student' | 'teacher' | 'admin';
}
