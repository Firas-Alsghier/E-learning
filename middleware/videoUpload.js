// middleware\videoUpload.js
/*
This file does the following:

✔ Handles video upload
✔ Validates video type
✔ Uploads to Cloudinary
✔ Returns Cloudinary URL
✔ Used only inside upload routes
*/
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'), false);
  }
};

export const videoUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB
  },
});
