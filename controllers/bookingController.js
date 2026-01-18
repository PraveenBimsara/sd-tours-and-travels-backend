const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const DayTour = require('../models/DayTour');
const { sendBookingConfirmation, sendAdminNotification } = require('../utils/mailer');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { tourType, tourId, customerInfo, travelDetails } = req.body;

    // Verify tour exists
    let tour;
    if (tourType === 'tour') {
      tour = await Tour.findById(tourId);
    } else {
      tour = await DayTour.findById(tourId);
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    // Create booking
    const booking = await Booking.create({
      tourType,
      tourId,
      tourTitle: tour.title,
      customerInfo,
      travelDetails
    });

    // Send confirmation email to customer and notification to admin
    try {
      // Prepare booking data for emails
      const bookingEmailData = {
        ...booking.toObject(),
        tourType,
        tourTitle: tour.title,
      };

      // Send emails (don't wait for them to complete)
      sendBookingConfirmation(bookingEmailData).catch(err => 
        console.error('Error sending customer confirmation email:', err)
      );
      
      sendAdminNotification(bookingEmailData).catch(err => 
        console.error('Error sending admin notification email:', err)
      );

      console.log('✅ Booking emails queued for sending');
    } catch (emailError) {
      // Log error but don't fail the booking
      console.error('Email sending error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Booking inquiry submitted successfully! We will contact you soon.',
      data: booking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate('tourId');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private/Admin
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('tourId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats/overview
// @access  Private/Admin
const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      data: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings
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
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingStats
};