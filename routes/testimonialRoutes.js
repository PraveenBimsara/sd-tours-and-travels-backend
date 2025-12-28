const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);
router.post('/', createTestimonial);

// Protected routes (Admin only)
router.put('/:id', protect, updateTestimonial);
router.put('/:id/approve', protect, approveTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;