const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/BookModel');
const Game = require('../models/Game');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create booking (prevents double booking + sends email)
router.post('/book', async (req, res) => {
  try {
    const { username, email, venue, date, time, location, people, price } = req.body;

    if (!venue || !date || !time || !email) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    // prevent double booking
    const existing = await Booking.findOne({
      venue,
      date,
      time,
      status: { $in: ['Pending', 'Confirmed'] },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'This slot is already booked' });
    }

    const game = await Game.findById(venue);
    const booking = new Booking({
      username,
      email,
      venue,
      date,
      time,
      location,
      people,
      price,
      status: 'Confirmed',
    });

    await booking.save();
    await booking.populate('venue');

    // Create PDF ticket
    const pdfPath = path.join(__dirname, `../tickets/ticket-${Date.now()}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(18).text('Gamio Booking Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${booking.username}`);
    doc.text(`Game: ${game.name}`);
    doc.text(`Location: ${booking.location}`);
    doc.text(`Date: ${new Date(booking.date).toLocaleDateString()}`);
    doc.text(`Time: ${booking.time}`);
    doc.text(`People: ${booking.people}`);
    doc.text(`Total Price: ₹${booking.price}`);
    doc.end();

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: '🎉 Gamio Booking Confirmed!',
      text: `Hi ${booking.username}, your booking for ${game.name} is confirmed!\nDate: ${booking.date}\nTime: ${booking.time}\nPeople: ${booking.people}`,
      attachments: [{ filename: 'Gamio-Ticket.pdf', path: pdfPath }],
    });

    res.status(201).json({ success: true, message: 'Booking confirmed', booking });
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Get all user bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('venue');
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});


module.exports = router;

// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const Venue = require('../models/Venue');

// // Create a pre-configured Axios instance for Hapio API calls
// const hapioApi = axios.create({
//   baseURL: 'https://api.hapio.io/v1',
//   headers: {
//     'Authorization': `Bearer ${process.env.HAPIO_API_KEY}`,
//     'Content-Type': 'application/json',
//   }
// });

// /**
//  * @route   GET /api/venues
//  * @desc    Get all venues from our own database
//  */
// router.get('/venues', async (req, res) => {
//   try {
//     const venues = await Venue.find();
//     res.json(venues);
//   } catch (error) {
//     console.error("Error fetching venues:", error);
//     res.status(500).send("Server Error");
//   }
// });

// /**
//  * @route   GET /api/slots/:venueId
//  * @desc    Get available slots for a specific venue from Hapio
//  */
// router.get('/slots/:venueId', async (req, res) => {
//   try {
//     const venue = await Venue.findById(req.params.venueId);
//     if (!venue) {
//       return res.status(404).json({ msg: 'Venue not found' });
//     }

//     // Define the time range for which you want to fetch slots
//     const start = new Date();
//     const end = new Date();
//     end.setDate(start.getDate() + 7); // Get slots for the next 7 days

//     // Call Hapio API to get slots for the specific resource
//     const response = await hapioApi.get('/slots', {
//       params: {
//         resourceId: venue.hapioResourceId,
//         start: start.toISOString(),
//         end: end.toISOString(),
//         duration: 60, // Duration in minutes (e.g., 1-hour slots)
//       },
//     });

//     res.json(response.data.data);
//   } catch (error) {
//     console.error("Hapio API Error:", error.response ? error.response.data : error.message);
//     res.status(500).send("Error fetching slots from Hapio");
//   }
// });


// /**
//  * @route   POST /api/book
//  * @desc    Create a new booking via Hapio
//  */
// router.post('/book', async (req, res) => {
//   const { resourceId, start, end, name, email } = req.body;

//   if (!resourceId || !start || !end || !name || !email) {
//     return res.status(400).json({ msg: 'Please provide all required booking details.' });
//   }

//   try {
//     const bookingPayload = {
//       resourceId,
//       start,
//       end,
//       attendees: [{ email }],
//       metadata: { customerName: name }
//     };

//     const response = await hapioApi.post('/bookings', bookingPayload);
//     res.status(201).json(response.data.data);

//   } catch (error) {
//     console.error("Hapio Booking Error:", error.response ? error.response.data : error.message);
//     res.status(500).send("Error creating booking with Hapio");
//   }
// });

// // ... (keep all existing routes and setup)

// /**
//  * @route   GET /api/bookings
//  * @desc    Get all bookings for a specific user via Hapio
//  * @query   email - The email of the user whose bookings to fetch
//  */
// router.get('/bookings', async (req, res) => {
//   const { email } = req.query;

//   if (!email) {
//     return res.status(400).json({ msg: 'Email query parameter is required.' });
//   }

//   try {
//     // Call the Hapio API to get bookings, filtering by the attendee's email
//     const response = await hapioApi.get('/bookings', {
//       params: {
//         attendee: email,
//       },
//     });

//     // Send the list of bookings back to the frontend
//     res.json(response.data.data);
//   } catch (error) {
//     console.error("Hapio API Error fetching bookings:", error.response ? error.response.data : error.message);
//     res.status(500).send("Error fetching bookings from Hapio");
//   }
// });

// module.exports = router;