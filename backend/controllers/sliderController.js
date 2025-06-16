const Slider = require('../models/Slider');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { cloudinary } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// @desc    Get all sliders
// @route   GET /api/sliders
// @access  Public
exports.getSliders = asyncHandler(async (req, res, next) => {
  const sliders = await Slider.find({ isActive: true })
    .sort('order')
    .select('-__v');

  res.status(200).json({
    success: true,
    count: sliders.length,
    data: sliders,
  });
});

// @desc    Get single slider
// @route   GET /api/sliders/:id
// @access  Public
exports.getSlider = asyncHandler(async (req, res, next) => {
  const slider = await Slider.findById(req.params.id);

  if (!slider) {
    return next(
      new ErrorResponse(`Slider not found with id of ${req.params.id}`, 404)
    );
  }


  res.status(200).json({
    success: true,
    data: slider,
  });
});

// @desc    Create new slider
// @route   POST /api/sliders
// @access  Private/Admin
exports.createSlider = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  // req.body.user = req.user.id;

  const slider = await Slider.create(req.body);

  res.status(201).json({
    success: true,
    data: slider,
  });
});

// @desc    Update slider
// @route   PUT /api/sliders/:id
// @access  Private/Admin
exports.updateSlider = asyncHandler(async (req, res, next) => {
  let slider = await Slider.findById(req.params.id);

  if (!slider) {
    return next(
      new ErrorResponse(`Slider not found with id of ${req.params.id}`, 404)
    );
  }


  slider = await Slider.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: slider,
  });
});

// @desc    Delete slider
// @route   DELETE /api/sliders/:id
// @access  Private/Admin
exports.deleteSlider = asyncHandler(async (req, res, next) => {
  const slider = await Slider.findById(req.params.id);

  if (!slider) {
    return next(
      new ErrorResponse(`Slider not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete image from cloudinary
  try {
    if (slider.image && slider.image.public_id) {
      await cloudinary.uploader.destroy(slider.image.public_id);
    }
    
    if (slider.thumbnail && slider.thumbnail.public_id) {
      await cloudinary.uploader.destroy(slider.thumbnail.public_id);
    }
  } catch (error) {
    console.error('Error deleting media from Cloudinary:', error);
    // Continue with deletion even if media deletion fails
  }

  await slider.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Upload photo for slider
// @route   PUT /api/sliders/:id/photo
// @access  Private/Admin
exports.sliderPhotoUpload = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const slider = await Slider.findById(req.params.id);
  if (!slider) {
    // Clean up the uploaded file if slider not found
    await cloudinary.uploader.destroy(req.file.filename);
    return next(
      new ErrorResponse(`Slider not found with id of ${req.params.id}`, 404)
    );
  }

  // If there's an existing image, delete it
  if (slider.image && slider.image.public_id) {
    try {
      await cloudinary.uploader.destroy(slider.image.public_id);
    } catch (error) {
      console.error('Error deleting old image:', error);
      // Continue even if deletion of old image fails
    }
  }

  // Save the image details to the slider
  slider.image = {
    public_id: req.file.filename,
    url: req.file.path,
  };

  await slider.save();

  res.status(200).json({
    success: true,
    data: slider.image,
  });
});

// @desc    Upload thumbnail for slider
// @route   PUT /api/sliders/:id/thumbnail
// @access  Private/Admin
exports.sliderThumbnailUpload = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const slider = await Slider.findById(req.params.id);
  if (!slider) {
    // Clean up the uploaded file if slider not found
    await cloudinary.uploader.destroy(req.file.filename);
    return next(
      new ErrorResponse(`Slider not found with id of ${req.params.id}`, 404)
    );
  }

  // If there's an existing thumbnail, delete it
  if (slider.thumbnail && slider.thumbnail.public_id) {
    try {
      await cloudinary.uploader.destroy(slider.thumbnail.public_id);
    } catch (error) {
      console.error('Error deleting old thumbnail:', error);
      // Continue even if deletion of old thumbnail fails
    }
  }

  // Save the thumbnail details to the slider
  slider.thumbnail = {
    public_id: req.file.filename,
    url: req.file.path,
  };

  await slider.save();

  res.status(200).json({
    success: true,
    data: slider.thumbnail,
  });
});

// @desc    Reorder sliders
// @route   PUT /api/sliders/reorder
// @access  Private/Admin
exports.reorderSliders = asyncHandler(async (req, res, next) => {
  const { sliders } = req.body;

  if (!sliders || !Array.isArray(sliders)) {
    return next(new ErrorResponse('Please provide an array of sliders with their new order', 400));
  }

  const bulkOps = sliders.map((slider) => ({
    updateOne: {
      filter: { _id: slider._id },
      update: { $set: { order: slider.order } },
    },
  }));

  await Slider.bulkWrite(bulkOps);

  const updatedSliders = await Slider.find().sort('order');

  res.status(200).json({
    success: true,
    count: updatedSliders.length,
    data: updatedSliders,
  });
});
