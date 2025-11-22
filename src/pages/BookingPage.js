import React, { useState, useEffect } from 'react';
import bookingService from '../pages/bookingService'; 


function BookingPage() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '' });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('');

  // 1. Fetch all venues from our database when the component first loads
  useEffect(() => {
    bookingService.getVenues()
      .then(response => {
        setVenues(response.data);
      })
      .catch(error => {
        console.error("Failed to fetch venues", error);
        setBookingStatus("Error: Could not load venues from the server.");
      });
  }, []);

  // 2. Fetch slots for a venue whenever a user selects one from the dropdown
  const handleVenueChange = async (e) => {
  const venueId = e.target.value;
  setSelectedVenue(venueId);
  setSelectedSlot(null);
  setSlots([]);
  setBookingStatus('');

  if (!venueId) return;

  // 👉 Get the selected venue object
  const venue = venues.find(v => v._id === venueId);

  if (!venue) {
    console.error("Selected venue not found");
    return;
  }

  setLoadingSlots(true);
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await bookingService.getSlots(venueId, today, venue.place);

    setSlots(response.data.slots || []);
  } catch (error) {
    console.error("Failed to fetch slots", error);
    setBookingStatus("Error: Could not load slots for this venue.");
  } finally {
    setLoadingSlots(false);
  }
};

  
  // 3. Update state as the user types in their details
  const handleCustomerChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value,
    });
  };

  // 4. Submit the complete booking details to the backend
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !customerDetails.name || !customerDetails.email) {
      alert("Please select a slot and fill in your details.");
      return;
    }
    
    const venue = venues.find(v => v._id === selectedVenue);
    if (!venue) {
        alert("An error occurred. Please re-select the venue.");
        return;
    }

    const bookingData = {
      resourceId: venue.hapioResourceId,
      start: selectedSlot.start,
      end: selectedSlot.end,
      name: customerDetails.name,
      email: customerDetails.email,
    };

    try {
      await bookingService.createBooking(bookingData);
      setBookingStatus(`Success! Booking confirmed for ${new Date(selectedSlot.start).toLocaleString()}. A confirmation has been sent to ${customerDetails.email}.`);
      setSelectedSlot(null); // Reset selection
      setSlots(slots.filter(slot => slot.start !== selectedSlot.start)); 
    } catch (error) {
      console.error("Booking failed", error);
      setBookingStatus("Booking failed. The slot may have been taken. Please try another.");
    }
  };

  return (
    <div className="booking-container card">
      <h1>Book a Venue</h1>
      <p>Select a venue to see available time slots.</p>
      
      {/* Step 1: Venue Selection */}
      <div className="form-group">
        <label htmlFor="venue-select">Select a Venue:</label>
        <select id="venue-select" onChange={handleVenueChange} value={selectedVenue} className="form-control">
          <option value="">-- Choose a Venue --</option>
          {venues.map(venue => (
            <option key={venue._id} value={venue._id}>
              {venue.name}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Slot Selection */}
      {loadingSlots && <p className="loading-text">Loading available slots...</p>}
      {slots.length > 0 && (
        <div className="slots-container">
          <h3>Available Slots:</h3>
          <div className="slots-grid">
            {slots.map(slot => (
              <button 
                key={slot.start} 
                className={`slot-btn ${selectedSlot?.start === slot.start ? 'selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {new Date(slot.start).toLocaleString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'Asia/Kolkata'
                })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Customer Details and Booking */}
      {selectedSlot && (
        <form onSubmit={handleBookingSubmit} className="booking-form">
          <h3>Confirm Your Booking</h3>
          <p>You have selected: <strong>{new Date(selectedSlot.start).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong></p>
          <div className="form-group">
            <label htmlFor="customer-name">Your Name:</label>
            <input id="customer-name" type="text" name="name" value={customerDetails.name} onChange={handleCustomerChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label htmlFor="customer-email">Your Email:</label>
            <input id="customer-email" type="email" name="email" value={customerDetails.email} onChange={handleCustomerChange} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary">Confirm Booking</button>
        </form>
      )}

      {bookingStatus && <p className="booking-status">{bookingStatus}</p>}
    </div>
  );
}

export default BookingPage;