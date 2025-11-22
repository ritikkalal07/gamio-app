import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookSlot() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);
  const [formData, setFormData] = useState({
    username: localStorage.getItem("username") || "Guest User",
    email: localStorage.getItem("email") || "",
    phone: "",
    people: 1,
  });

  const minDate = new Date().toISOString().split("T")[0];

  //  Fetch available slots from DB
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setMessage("");
       const correctDate = new Date(selectedDate).toISOString().split("T")[0];

        const response = await axios.get(
          `http://localhost:5000/api/slots/${id}?date=${correctDate}`
        );


        // If backend returned slots created by admin
        if (response.data.success && Array.isArray(response.data.slots)) {
          if (response.data.slots.length === 0) {
            setMessage("");
            setSlots([]);
          } else {
            setSlots(response.data.slots);
          }
        } else {
          setMessage("⚠️ No slots available. Please check again later.");
          setSlots([]);
        }
      } catch (err) {
        console.error(err);
        setMessage("⚠️ Service currently unavailable for this game.");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [id, selectedDate]);

  //  Handle slot click
  const handleSlotClick = (slot) => {
    if (slot.isBooked) return alert("This slot is already booked!");
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Please login to book a slot.");
    setActiveSlot(slot);
  };

  //  Form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "people" ? Number(value) : value,
    }));
  };

  //  Submit booking
 // In the submitBooking function, fix the navigation:
const submitBooking = async (e) => {
  e.preventDefault();
  if (!activeSlot) return setMessage("No slot selected.");
  if (!formData.email || !formData.phone)
    return setMessage("Please fill all details before booking.");

  setLoading(true);
  setMessage("Booking your slot...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login to continue.");
      setLoading(false);
      return;
    }

    const bookingData = {
      username: formData.username,
      email: formData.email,
      venueId: id,               
      date: selectedDate,
      time: activeSlot.startTime,
      people: formData.people,
      price: activeSlot.price,
    };

    const response = await axios.post(
      "http://localhost:5000/api/bookings/book",
      bookingData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      const booking = response.data.booking;
      
      // Navigate to payment with proper booking data
      navigate("/pay", {
        state: {
          bookingData: {
            _id: booking._id,
            venueName: booking.venueName || "Unknown Venue",
            date: booking.date,
            time: booking.time,
            price: booking.price,
          }
        }
      });
    } else {
      setMessage(response.data.message || "Booking failed.");
    }
  } catch (err) {
    console.error("Booking error:", err);
    if (err.response?.status === 401) {
      setMessage("Session expired. Please login again.");
      localStorage.removeItem("token");
    } else {
      setMessage(err.response?.data?.message || "Failed to book slot.");
    }
  } finally {
    setLoading(false);
  }
};
  const handleCancel = () => {
    setActiveSlot(null);
  };

  return (
    <main className="book-slot__main">
      <div className="book-slot__container">
        <div className="book-slot__card">
          {/*  Booking Success Screen */}
          {isBookingConfirmed ? (
            <div style={successContainerStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width="140"
                height="140"
                style={{ marginBottom: "1.5rem" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                  style={{ animation: "dash 1s ease-out forwards" }}
                />
                <polyline
                  points="30,53 45,70 75,35"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: "tick 0.6s ease-out forwards 0.6s" }}
                />
                <style>{`
                  @keyframes dash { to { stroke-dashoffset: 0; } }
                  @keyframes tick { from { stroke-dashoffset: 50; opacity: 0; } to { stroke-dashoffset: 0; opacity: 1; } }
                `}</style>
              </svg>

              <h2 style={{ color: "#10b981", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
                Booking Confirmed! 🎉
              </h2>
              <p style={{ color: "#374151", fontSize: "1rem", marginBottom: "1rem" }}>
                Your slot is successfully booked.
              </p>
              <p style={{ color: "#6b7280" }}>
                A confirmation email with your ticket has been sent to{" "}
                <strong>{formData.email}</strong>.
              </p>
            </div>
          ) : activeSlot ? (
            //  Booking Form
            <div style={formCardStyle}>
              <h2 style={{ textAlign: "center", color: "#111827" }}>Confirm Booking</h2>
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                <strong>Slot:</strong> {activeSlot.startTime} &nbsp; | &nbsp;
                <strong>Price:</strong> ₹{activeSlot.price}
              </p>
              <form onSubmit={submitBooking} style={formStyle}>
                <div style={inputGroupStyle}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label>People</label>
                  <input
                    type="number"
                    name="people"
                    min={1}
                    value={formData.people}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={buttonGroupStyle}>
                  <button type="submit" style={confirmButtonStyle} disabled={loading}>
                    {loading ? "Booking..." : "Confirm Booking"}
                  </button>
                  <button type="button" style={cancelButtonStyle} onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            //  Show slots or unavailable message
            <>
              <h2 className="book-slot__title">Book a Slot</h2>
              <div className="date-selector">
                <input
                  type="date"
                  value={selectedDate}
                  min={minDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-input"
                />
              </div>

              {loading ? (
                <div className="loading-message">Loading slots...</div>
              ) : slots.length === 0 ? (
                <p
                  className="no-slots-message"
                  style={{
                    color: "#f59e0b",
                    fontWeight: 500,
                    textAlign: "center",
                    marginTop: "1rem",
                  }}
                >
                  ⚠️ No slots added yet for this game. Service currently unavailable.
                </p>
              ) : (
                <div className="slots-grid">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.isBooked || loading}
                      className={`slot-button ${
                        slot.isBooked
                          ? "slot-button--booked"
                          : "slot-button--available"
                      }`}
                    >
                      <div className="slot-time">{slot.displayTime || slot.startTime}</div>
                      <div className="slot-price">₹{slot.price}</div>
                      <div className="slot-availability">
                        {slot.isBooked ? "Booked" : "Available"}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          {message && (
            <div
              className="message-box"
              style={{
                color: "#dc2626",
                textAlign: "center",
                fontWeight: 500,
                marginTop: "1rem",
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* 🎨 Styles (same UI) */
const successContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 1rem",
  textAlign: "center",
  background: "#f9fafb",
  borderRadius: "12px",
};
const formCardStyle = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  maxWidth: "480px",
  margin: "0 auto",
};
const formStyle = { display: "flex", flexDirection: "column", marginTop: "1.2rem" };
const inputGroupStyle = { marginBottom: "1rem", display: "flex", flexDirection: "column" };
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "1rem",
};
const buttonGroupStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "1rem",
};
const confirmButtonStyle = {
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};
const cancelButtonStyle = {
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default BookSlot;
