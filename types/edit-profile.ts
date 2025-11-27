export interface Profile {
  _id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  headline?: string;
  language?: string;
  country?: string;

  gender?: 'male' | 'female';
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
  social?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
  };

  role?: 'student' | 'teacher' | 'admin';
}
