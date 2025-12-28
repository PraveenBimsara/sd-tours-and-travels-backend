const DayTour = require('../models/DayTour');

// @desc    Get all day tours
// @route   GET /api/day-tours
// @access  Public
const getDayTours = async (req, res) => {
  try {
    const { featured, search } = req.query;
    
    let query = { status: 'active' };

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const dayTours = await DayTour.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: dayTours.length,
      data: dayTours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single day tour
// @route   GET /api/day-tours/:id
// @access  Public
const getDayTour = async (req, res) => {
  try {
    const dayTour = await DayTour.findById(req.params.id);

    if (!dayTour) {
      return res.status(404).json({
        success: false,
        message: 'Day tour not found'
      });
    }

    res.json({
      success: true,
      data: dayTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get day tour by slug
// @route   GET /api/day-tours/slug/:slug
// @access  Public
const getDayTourBySlug = async (req, res) => {
  try {
    const dayTour = await DayTour.findOne({ slug: req.params.slug });

    if (!dayTour) {
      return res.status(404).json({
        success: false,
        message: 'Day tour not found'
      });
    }

    res.json({
      success: true,
      data: dayTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new day tour
// @route   POST /api/day-tours
// @access  Private/Admin
const createDayTour = async (req, res) => {
  try {
    const dayTour = await DayTour.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Day tour created successfully',
      data: dayTour
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update day tour
// @route   PUT /api/day-tours/:id
// @access  Private/Admin
const updateDayTour = async (req, res) => {
  try {
    const dayTour = await DayTour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!dayTour) {
      return res.status(404).json({
        success: false,
        message: 'Day tour not found'
      });
    }

    res.json({
      success: true,
      message: 'Day tour updated successfully',
      data: dayTour
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete day tour
// @route   DELETE /api/day-tours/:id
// @access  Private/Admin
const deleteDayTour = async (req, res) => {
  try {
    const dayTour = await DayTour.findByIdAndDelete(req.params.id);

    if (!dayTour) {
      return res.status(404).json({
        success: false,
        message: 'Day tour not found'
      });
    }

    res.json({
      success: true,
      message: 'Day tour deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDayTours,
  getDayTour,
  getDayTourBySlug,
  createDayTour,
  updateDayTour,
  deleteDayTour
};