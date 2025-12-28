import React, { useState, useEffect } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [expanded, setExpanded] = useState(null); // which booking is expanded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelPopup, setCancelPopup] = useState({ visible: false, bookingId: null });

  // ✅ Fetch bookings for logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your bookings.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setBookings(response.data.bookings);
        } else {
          setError("Failed to load bookings. Please try again.");
        }
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setError("Unable to fetch bookings. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Toggle details view
  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  // ✅ Open popup
  const openCancelPopup = (bookingId) => {
    setCancelPopup({ visible: true, bookingId });
  };

  // ✅ Close popup
  const closeCancelPopup = () => {
    setCancelPopup({ visible: false, bookingId: null });
  };

  // ✅ Confirm cancel logic
  const confirmCancel = async () => {
    const bookingId = cancelPopup.bookingId;
    if (!bookingId) return closeCancelPopup();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // Remove locally from state so UI updates instantly
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        alert(res.data.message || "Booking cancelled successfully.");
      } else {
        alert(res.data.message || "Failed to cancel booking. Try again.");
      }
    } catch (error) {
      console.error("Cancel error frontend:", error);
      const serverMsg = error.response?.data?.message || error.message || "Something went wrong while cancelling.";
      alert(serverMsg);
    } finally {
      closeCancelPopup();
    }
  };

  return (
    <div className="my-bookings-page" style={pageStyle}>
      <h2 style={titleStyle}>My Bookings</h2>

      {loading && <p style={textStyle}>Loading your bookings...</p>}
      
      {error && <p style={{ ...textStyle, color: "red" }}>{error}</p>}
      
      {/* Only show "No bookings" if not loading AND no error AND empty list */}
      {!loading && !error && bookings.length === 0 && (
        <p style={textStyle}>No bookings found.</p>
      )}

      <div style={cardGridStyle}>
        {bookings.map((booking) => (
          <div key={booking._id} style={cardStyle}>
            <div
              style={cardHeaderStyle}
              onClick={() => toggleExpand(booking._id)}
            >
              <div>
                {/* 🔴 FIX: Used venueId instead of venue */}
                <h3 style={{ marginBottom: "5px", fontSize: "1.1rem" }}>
                  {booking.venueId?.name || "Booked Venue"}
                </h3>
                <p style={{ margin: 0, color: "#555" }}>
                  {new Date(booking.date).toLocaleDateString()} — {booking.time}
                </p>
              </div>
              
              <span
                style={{
                  ...statusBadgeStyle,
                  backgroundColor:
                    booking.status === "Cancelled" ? "#f87171" : "#10b981",
                }}
              >
                {booking.status || "Confirmed"}
              </span>
            </div>

            {expanded === booking._id && (
              <div style={detailsBoxStyle}>
                <h4>Booking Details</h4>
                <p><strong>Name:</strong> {booking.username}</p>
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>People:</strong> {booking.people}</p>
                
                {/* 🔴 FIX: Accessed location via venueId */}
                <p><strong>Location:</strong> {booking.venueId?.location || "N/A"}</p>
                
                <p><strong>Price:</strong> ₹{booking.price}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.time}</p>

                {/* Only show Cancel button if not already cancelled */}
                {booking.status !== "Cancelled" && (
                  <button
                    onClick={() => openCancelPopup(booking._id)}
                    style={cancelButtonStyle}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Custom Confirmation Popup */}
      {cancelPopup.visible && (
        <div style={popupOverlayStyle}>
          <div style={popupBoxStyle}>
            <h3 style={{ marginBottom: "1rem" }}>Cancel Booking</h3>
            <p style={{ marginBottom: "1.5rem", color: "#374151" }}>
              Are you sure you want to cancel this booking?
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button
                onClick={confirmCancel}
                style={{
                  ...popupButtonStyle,
                  backgroundColor: "#ef4444",
                  color: "#fff",
                }}
              >
                Yes, Cancel
              </button>
              <button
                onClick={closeCancelPopup}
                style={{
                  ...popupButtonStyle,
                  backgroundColor: "#10b981",
                  color: "#fff",
                }}
              >
                No, Keep It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 Styles */
const pageStyle = {
  padding: "2rem 1rem",
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
};

const titleStyle = {
  textAlign: "center",
  color: "#111827",
  marginBottom: "1.5rem",
  fontSize: "2rem",
};

const textStyle = {
  textAlign: "center",
  color: "#6b7280",
  fontSize: "1rem",
};

const cardGridStyle = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  justifyContent: "center",
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  overflow: "hidden",
  cursor: "pointer",
  transition: "0.3s",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 1.2rem",
  borderBottom: "1px solid #e5e7eb",
};

const statusBadgeStyle = {
  padding: "6px 12px",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "0.85rem",
  fontWeight: "500",
};

const detailsBoxStyle = {
  padding: "1rem 1.2rem",
  backgroundColor: "#f3f4f6",
  borderTop: "1px solid #e5e7eb",
};

const cancelButtonStyle = {
  backgroundColor: "#ef4444",
  color: "#fff",
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  marginTop: "0.8rem",
  transition: "background-color 0.3s ease",
};

/* ✅ Custom Popup */
const popupOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupBoxStyle = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  textAlign: "center",
  width: "90%",
  maxWidth: "400px",
};

const popupButtonStyle = {
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "0.3s",
};

export default MyBookings;