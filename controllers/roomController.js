const Room = require('../models/Room');
const Booking = require('../models/Booking');

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { name, type, pricePerNight, capacity, description, status } = req.body;
    const newRoom = new Room({ name, type, pricePerNight, capacity, description, status });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Prevent changing status to 'available' if active booking exists
    if (status === 'available') {
      const activeBooking = await Booking.findOne({
        room: id,
        endDate: { $gte: new Date() }
      });
      
      if (activeBooking) {
        return res.status(400).json({ 
          error: 'Cannot mark available: Room has an active booking.' 
        });
      }
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({ error: 'Room not found' });
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seedRooms = async () => {
  try {
    const count = await Room.countDocuments();
    const sample = await Room.findOne();
    
    // Re-seed if empty OR if the sample data lacks new fields (bedSize)
    if (count === 0 || (sample && !sample.bedSize)) {
      console.log('Seeding room units with new details...');
      
      if (count > 0) {
        await Room.deleteMany({});
      }

      const roomTypes = [
        { 
          type: 'Deluxe Suite', 
          price: 200, 
          capacity: 2, 
          desc: 'A beautiful suite with sea view.',
          bedSize: 'King Bed',
          amenities: ['WiFi', 'Ocean View', 'Mini Bar', 'Jacuzzi']
        },
        { 
          type: 'Standard Room', 
          price: 100, 
          capacity: 2, 
          desc: 'Cozy room for a comfortable stay.',
          bedSize: 'Queen Bed',
          amenities: ['WiFi', 'TV', 'Coffee Maker']
        },
        { 
          type: 'Presidential Suite', 
          price: 500, 
          capacity: 4, 
          desc: 'Luxury at its finest.',
          bedSize: 'California King',
          amenities: ['Private Pool', 'Butler Service', 'Home Theater', 'Gym']
        },
        { 
          type: 'Family Room', 
          price: 150, 
          capacity: 4, 
          desc: 'Perfect for families.',
          bedSize: '2 Queen Beds',
          amenities: ['WiFi', 'Kitchenette', 'Board Games']
        }
      ];

      const roomsToInsert = [];

      roomTypes.forEach((rt, typeIndex) => {
        for (let i = 1; i <= 4; i++) {
          const statuses = ['available', 'available', 'cleaning', 'taken'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          const roomNum = (typeIndex + 1) * 100 + i;
          
          roomsToInsert.push({
            name: `Room ${roomNum}`,
            type: rt.type,
            pricePerNight: rt.price,
            capacity: rt.capacity,
            description: rt.desc,
            status: randomStatus,
            bedSize: rt.bedSize,
            amenities: rt.amenities
          });
        }
      });
      
      await Room.insertMany(roomsToInsert);
      console.log('Rooms seeded successfully with details');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};
