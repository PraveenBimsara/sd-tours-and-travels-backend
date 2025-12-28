const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add customer name']
  },
  country: {
    type: String,
    required: [true, 'Please add country']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: [true, 'Please add review text'],
    maxlength: [500, 'Review cannot be more than 500 characters']
  },
  tourName: String,
  image: String,
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);