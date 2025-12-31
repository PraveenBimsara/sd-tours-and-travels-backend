const express = require('express');
const router = express.Router();
const {
  getTours,
  getTour,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
  getFeaturedTours
} = require('../controllers/tourController');
const { protect } = require('../middleware/authMiddleware');

// Public routes - specific routes FIRST
router.get('/featured/list', getFeaturedTours);
router.get('/slug/:slug', getTourBySlug);
router.get('/', getTours);
router.get('/:id', getTour);

// Protected routes (Admin only)
router.post('/', protect, createTour);
router.put('/:id', protect, updateTour);
router.delete('/:id', protect, deleteTour);

module.exports = router;