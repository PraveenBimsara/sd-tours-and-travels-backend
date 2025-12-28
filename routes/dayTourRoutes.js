const express = require('express');
const router = express.Router();
const {
  getDayTours,
  getDayTour,
  getDayTourBySlug,
  createDayTour,
  updateDayTour,
  deleteDayTour
} = require('../controllers/dayTourController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getDayTours);
router.get('/slug/:slug', getDayTourBySlug);
router.get('/:id', getDayTour);

// Protected routes (Admin only)
router.post('/', protect, createDayTour);
router.put('/:id', protect, updateDayTour);
router.delete('/:id', protect, deleteDayTour);

module.exports = router;