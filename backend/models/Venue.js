const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // This is the crucial link between our app and Hapio's system
  hapioResourceId: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Venue', venueSchema);