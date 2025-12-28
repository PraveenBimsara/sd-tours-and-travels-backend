const mongoose = require('mongoose');

const dayTourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a day tour title'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  duration: {
    type: String,
    default: '1 Day'
  },
  pickupTime: String,
  dropoffTime: String,
  mainImage: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String
  }],
  highlights: [String],
  included: [String],
  excluded: [String],
  itinerary: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  maxGroupSize: Number
}, {
  timestamps: true
});

// Create slug from title
dayTourSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('DayTour', dayTourSchema);