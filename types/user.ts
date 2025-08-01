export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  language?: string;
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
}
