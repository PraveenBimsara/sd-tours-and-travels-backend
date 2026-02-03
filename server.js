const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/tours', require('./routes/tourRoutes'));
app.use('/api/day-tours', require('./routes/dayTourRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes')); // ✅ NEW: Gallery routes

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SD Tours & Travel API',
    version: '1.0.0',
    endpoints: {
      tours: '/api/tours',
      dayTours: '/api/day-tours',
      bookings: '/api/bookings',
      testimonials: '/api/testimonials',
      contact: '/api/contact',
      admin: '/api/admin',
      gallery: '/api/gallery' // ✅ NEW
    }
  });
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});