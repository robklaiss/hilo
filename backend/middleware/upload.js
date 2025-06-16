const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hilo',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }],
  },
});

// File filter for image files only
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith('image')) {
    return cb(new ErrorResponse('Only image files are allowed!', 400), false);
  }
  cb(null, true);
};

// Initialize multer with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Middleware to handle file upload errors
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred during upload
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ErrorResponse('File size too large. Max 5MB allowed.', 400));
    }
    return next(new ErrorResponse(`File upload error: ${err.message}`, 400));
  } else if (err) {
    // An unknown error occurred
    return next(new ErrorResponse(err.message, 500));
  }
  next();
};

// Generate a unique filename
const generateFilename = (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname).toLowerCase();
  return `file-${uniqueSuffix}${ext}`;
};

module.exports = {
  upload,
  handleUploadErrors,
  cloudinary,
};
