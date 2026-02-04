export interface Course {
  title: string;
  category: string;
  description: string;
  author: string;
  duration: string;
  studentsCount: number;
  level: string;
  lessons: number;
  quizzesCount: number;
  price: number;
  oldPrice?: number;
  coverImage: string;
}

export interface Index {
  _id: string;
  title: string;
  slug: string;
  author: string;
  // ✅ ADD THIS
  image?: string;

  teacher?: {
    firstName?: string;
    lastName?: string;
  };

  studentsCount?: number;
  totalDuration?: string;
  level?: string;
  lessonsCount?: number;
  price: number;
  oldPrice?: number;
  category?: string;
}
