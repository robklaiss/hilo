const express = require('express');
const router = express.Router();
const {
  getSliders,
  getSlider,
  createSlider,
  updateSlider,
  deleteSlider,
  sliderPhotoUpload,
  sliderThumbnailUpload,
  reorderSliders,
} = require('../controllers/sliderController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadErrors } = require('../middleware/upload');

// Configure upload for slider images
const sliderImageUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// Public routes
router.route('/').get(getSliders);
router.route('/:id').get(getSlider);

// Protected routes (require authentication and admin role)
router.use(protect);
router.use(authorize('admin'));

// Slider CRUD routes
router.route('/').post(createSlider);
router
  .route('/:id')
  .put(updateSlider)
  .delete(deleteSlider);

// Image upload routes
router
  .route('/:id/photo')
  .put(upload.single('file'), sliderPhotoUpload);

router
  .route('/:id/thumbnail')
  .put(upload.single('file'), sliderThumbnailUpload);

// Reorder sliders route
router.route('/reorder').put(reorderSliders);

module.exports = router;
