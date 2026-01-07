const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: String,
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'confirmed' }
});

module.exports = mongoose.model('Booking', bookingSchema);
