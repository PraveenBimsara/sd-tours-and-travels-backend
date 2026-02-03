const express = require('express');
const router = express.Router();
const {
  getGalleryImages,
  uploadGalleryImage,
  uploadMultipleGalleryImages,
  updateGalleryImage,
  deleteGalleryImage
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route
router.get('/', getGalleryImages);

// Protected routes (Admin only)
router.post('/upload', protect, upload.single('galleryImage'), uploadGalleryImage);           // single image
router.post('/upload-multiple', protect, upload.array('galleryImage', 20), uploadMultipleGalleryImages); // multiple images (max 20)
router.put('/:id', protect, updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

module.exports = router;
