const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a tour title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  duration: {
    days: {
      type: Number,
      required: true
    },
    nights: {
      type: Number,
      required: true
    }
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: true,
    enum: ['Adventure', 'Wildlife', 'Culture', 'Relaxation', 'Romantic', 'Budget']
  },
  images: [{
    url: String,
    caption: String
  }],
  mainImage: {
    type: String,
    required: true
  },
  highlights: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String]
  }],
  included: [String],
  excluded: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'coming-soon'],
    default: 'active'
  },
  tags: [String],
  maxGroupSize: Number,
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Difficult']
  }
}, {
  timestamps: true
});

// Create slug from title before saving
tourSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Tour', tourSchema);