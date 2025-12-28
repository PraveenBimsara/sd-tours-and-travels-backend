const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  replyContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.post('/', submitContact);

// Protected routes (Admin only)
router.get('/', protect, getContacts);
router.get('/:id', protect, getContact);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);
router.post('/:id/reply', protect, replyContact);

module.exports = router;