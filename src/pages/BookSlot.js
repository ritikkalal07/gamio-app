import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const mockSlotsData = [
  { id: uuidv4(), date: "2025-09-25", startTime: "09:00 AM", price: 250, isBooked: false, availableCount: 1 },
  { id: uuidv4(), date: "2025-09-25", startTime: "10:00 AM", price: 250, isBooked: true, availableCount: 0 },
  { id: uuidv4(), date: "2025-09-25", startTime: "11:00 AM", price: 250, isBooked: false, availableCount: 1 },
  { id: uuidv4(), date: "2025-09-25", startTime: "12:00 PM", price: 300, isBooked: false, availableCount: 1 },
  { id: uuidv4(), date: "2025-09-25", startTime: "01:00 PM", price: 300, isBooked: false, availableCount: 1 },
  { id: uuidv4(), date: "2025-09-24", startTime: "09:00 AM", price: 250, isBooked: false, availableCount: 1 },
  { id: uuidv4(), date: "2025-09-24", startTime: "10:00 AM", price: 250, isBooked: false, availableCount: 1 },
  { id: uuidv4(), date: "2025-09-24", startTime: "11:00 AM", price: 250, isBooked: true, availableCount: 0 },
  { id: uuidv4(), date: "2025-09-24", startTime: "12:00 PM", price: 300, isBooked: false, availableCount: 1 },
];

function BookSlot() {
  const { id } = useParams();
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  useEffect(() => {
    // Simulate fetching data from an API
    setLoading(true);
    setMessage("");

    const fetchMockSlots = () => {
      // In a real app, this would be an API call, e.g., axios.get(...)
      const filteredSlots = mockSlotsData.filter(
        slot => slot.date === selectedDate
      );
      setSlots(filteredSlots);
      setLoading(false);
    };

    fetchMockSlots();
  }, [selectedDate, id]);

  const handleSlotClick = (slotId) => {
    if (loading) return;
    
    setLoading(true);
    setMessage(`Booking slot...`);
    
    setTimeout(() => {
        const updatedSlots = slots.map(slot => 
            slot.id === slotId ? { ...slot, isBooked: true, availableCount: 0 } : slot
        );
        setSlots(updatedSlots);
        setLoading(false);
        setMessage("Slot booked successfully!");
        setIsBookingConfirmed(true);
        
        
    }, 1500); 
  };

  const handleViewBookings = () => {
    
    console.log("Navigating to My Bookings page...");
  };

  return (
    <main className="book-slot__main">
      <div className="book-slot__container">
        <div className="book-slot__card">
          {isBookingConfirmed ? (
            <div className="confirmation-screen">
              <svg className="confirmation-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-8.85" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h2 className="confirmation-title">Booking Confirmed!</h2>
              <p className="confirmation-message">Your slot has been successfully booked.</p>
              <button onClick={handleViewBookings} className="confirmation-button">View My Bookings</button>
            </div>
          ) : (
            <>
              <h2 className="book-slot__title">Book a Slot</h2>
              
              {/* Progress Bar */}
              <div className="progress-bar">
                <span className="progress-bar__step progress-bar__step--active">Sport</span>
                <span className="progress-bar__step progress-bar__step--active">Facility</span>
                <span className="progress-bar__step progress-bar__step--active">Slots</span>
                <span className="progress-bar__step">Summary</span>
              </div>
              
              {/* Date Selector */}
              <div className="date-selector">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-input"
                />
              </div>

              {/* Slots Grid */}
              {loading ? (
                <div className="loading-message">Loading slots...</div>
              ) : (
                <div className="slots-grid">
                  {slots.length === 0 ? (
                    <p className="no-slots-message">
                      No slots available for this date.
                    </p>
                  ) : (
                    slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotClick(slot.id)}
                        disabled={slot.isBooked}
                        className={`slot-button ${slot.isBooked ? 'slot-button--booked' : 'slot-button--available'}`}
                      >
                        <div className="slot-time">{slot.startTime}</div>
                        <div className="slot-price">₹{slot.price}</div>
                        <div className="slot-availability">
                          {slot.isBooked ? "Booked" : `${slot.availableCount} left`}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
              
              {/* Message for user feedback */}
              {message && (
                <div className="message-box">
                  {message}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default BookSlot;
