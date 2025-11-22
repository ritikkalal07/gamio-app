// src/pages/bookingService.js
import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

// Public / user endpoints
const getVenues = () => axios.get(`${API_URL}/games`);

// fetch slots for a venue and date (frontend)
const getSlots = async (venueId, date, location = 'Ahmedabad') => {
  const res = await axios.get(`${API_URL}/slots/${venueId}`, {
    params: { date, location },
  });
  return res.data.slots || [];
};

// Bookings endpoints (example existing)
// const createBooking = (data, token) => axios.post(`${API_URL}/bookings/book`, data, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

// ----------------- Admin endpoints (Option B) -----------------

// Create slots (admin)
const adminCreateSlots = (payload, token) =>
  axios.post(`${API_URL}/slots/admin`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

// Get slots for a venue (admin)
const adminGetSlots = (venueId, token) =>
  axios.get(`${API_URL}/slots/admin/${venueId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

// Delete a slot (admin)
const adminDeleteSlot = (slotId, token) =>
  axios.delete(`${API_URL}/slots/admin/${slotId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

// Export all
export default {
  getVenues,
  getSlots,
  adminCreateSlots,
  adminGetSlots,
  adminDeleteSlot,
  // add other functions you already had below...
};
