const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "101", "Room 204"
  type: { type: String, required: true }, // e.g., "Deluxe Suite", "Standard Room"
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true },
  description: String,
  bedSize: String, // e.g., "King", "Queen", "2 Twin"
  amenities: [String], // e.g., ["WiFi", "TV", "Mini Bar"]
  status: { 
    type: String, 
    enum: ['available', 'cleaning', 'taken'], 
    default: 'available' 
  }
});

module.exports = mongoose.model('Room', roomSchema);
