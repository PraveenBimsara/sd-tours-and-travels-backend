const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins,
  deleteAdmin,
  getDashboardStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes
router.get('/profile', protect, getAdminProfile);
router.put('/profile', protect, updateAdminProfile);
router.get('/list', protect, getAllAdmins);
router.delete('/:id', protect, deleteAdmin);
router.get('/dashboard/stats', protect, getDashboardStats);

module.exports = router;