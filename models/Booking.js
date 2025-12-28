const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tourType: {
    type: String,
    enum: ['tour', 'dayTour'],
    required: true
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tourType',
    required: true
  },
  tourTitle: {
    type: String,
    required: true
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Please provide your name']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number']
    },
    country: String,
    whatsapp: String
  },
  travelDetails: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    numberOfPeople: {
      adults: {
        type: Number,
        required: true,
        min: 1
      },
      children: {
        type: Number,
        default: 0
      }
    },
    specialRequests: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalPrice: Number,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);