const Gallery = require('../models/Gallery');
const upload = require('../middleware/uploadMiddleware');
const path = require('path');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload single gallery image
// @route   POST /api/gallery/upload
// @access  Private/Admin
const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }

    const { caption } = req.body;

    // Get current max displayOrder
    const lastImage = await Gallery.findOne().sort({ displayOrder: -1 });
    const nextOrder = lastImage ? lastImage.displayOrder + 1 : 1;

    const image = await Gallery.create({
      imageUrl: `/uploads/gallery/${req.file.filename}`,
      caption: caption || '',
      displayOrder: nextOrder
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload multiple gallery images
// @route   POST /api/gallery/upload-multiple
// @access  Private/Admin
const uploadMultipleGalleryImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Get current max displayOrder
    const lastImage = await Gallery.findOne().sort({ displayOrder: -1 });
    let nextOrder = lastImage ? lastImage.displayOrder + 1 : 1;

    const images = req.files.map((file) => ({
      imageUrl: `/uploads/gallery/${file.filename}`,
      caption: '',
      displayOrder: nextOrder++
    }));

    const insertedImages = await Gallery.insertMany(images);

    res.status(201).json({
      success: true,
      message: `${insertedImages.length} images uploaded successfully`,
      data: insertedImages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update gallery image caption
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: image
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getGalleryImages,
  uploadGalleryImage,
  uploadMultipleGalleryImages,
  updateGalleryImage,
  deleteGalleryImage
};