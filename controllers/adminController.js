const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/authMiddleware');

// @desc    Register new admin (first time only)
// @route   POST /api/admin/register
// @access  Public (should be protected in production)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin'
    });

    if (admin) {
      res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id)
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin email
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      admin.name = req.body.name || admin.name;
      admin.email = req.body.email || admin.email;

      if (req.body.password) {
        admin.password = req.body.password;
      }

      const updatedAdmin = await admin.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedAdmin._id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          role: updatedAdmin.role
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all admins
// @route   GET /api/admin/list
// @access  Private/Superadmin
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});

    res.json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private/Superadmin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const Tour = require('../models/Tour');
    const Booking = require('../models/Booking');
    const Testimonial = require('../models/Testimonial');
    const Contact = require('../models/Contact');

    const totalTours = await Tour.countDocuments();
    const activeTours = await Tour.countDocuments({ status: 'active' });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const totalTestimonials = await Testimonial.countDocuments();
    const pendingTestimonials = await Testimonial.countDocuments({ status: 'pending' });
    const unreadMessages = await Contact.countDocuments({ status: 'new' });

    res.json({
      success: true,
      data: {
        tours: {
          total: totalTours,
          active: activeTours
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings
        },
        testimonials: {
          total: totalTestimonials,
          pending: pendingTestimonials
        },
        messages: {
          unread: unreadMessages
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins,
  deleteAdmin,
  getDashboardStats
};