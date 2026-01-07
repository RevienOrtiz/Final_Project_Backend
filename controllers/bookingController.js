const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }   
};

exports.createBooking = async (req, res) => {
  try {
    const { customerName, customerPhone, room, startDate, endDate, status } = req.body;
    
    if (!customerName || !room || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for overlapping bookings
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const existingBooking = await Booking.findOne({
      room: room,
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Room is already booked for these dates' });
    }

    const newBooking = new Booking({
      customerName,
      customerPhone,
      room,
      startDate,
      endDate,
      status
    });

    await newBooking.save();
    
    // Automatically update room status to 'taken'
    if (room) {
      await Room.findByIdAndUpdate(room, { status: 'taken' });
    }

    await newBooking.populate('room'); 
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating booking ${id} with:`, req.body);
    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true }).populate('room');
    
    if (!updatedBooking) {
      console.log('Booking not found');
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    
    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
