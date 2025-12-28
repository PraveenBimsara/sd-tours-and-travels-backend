const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingStats
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.post('/', createBooking);

// Protected routes (Admin only)
router.get('/', protect, getBookings);
router.get('/stats/overview', protect, getBookingStats);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;