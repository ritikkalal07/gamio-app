import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;
  const details = location.state?.details;
  
  // State to hold the fetched game name
  const [gameName, setGameName] = useState("Game Session");

  useEffect(() => {
    // Function to fetch the real game name
    const fetchGameDetails = async () => {
      if (!booking) return;

      // 1. If name is already passed and valid, use it
      if (booking.venueName && booking.venueName !== "Unknown Venue") {
        setGameName(booking.venueName);
        return;
      }

      // 2. If we have a venueId (from BookSlot fix), fetch from API
      const vid = booking.venueId || booking.venue;
      if (vid) {
        try {
          // Handle case where vid might be an object
          const idString = typeof vid === 'object' ? vid._id : vid;
          
          const res = await axios.get(`http://localhost:5000/api/games/${idString}`);
          if (res.data.success) {
            setGameName(res.data.game.name);
          }
        } catch (err) {
          console.error("Error fetching game name:", err);
        }
      }
    };

    fetchGameDetails();
  }, [booking]);

  // Safety Redirect
  if (!booking || !details) {
    return (
      <div style={styles.pageBackground}>
        <div style={styles.errorCard}>
          <h2>🚫 Access Denied</h2>
          <p>No payment details found.</p>
          <button onClick={() => navigate("/")} style={styles.primaryButton}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <div style={styles.card}>
          
          {/* Success Icon Animation */}
          <div style={styles.iconContainer}>
            <svg style={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 style={styles.title}>Payment Successful!</h1>
          <p style={styles.subtitle}>
            Your booking is confirmed. A receipt and ticket have been sent to <strong>{booking.email || "your email"}</strong>.
          </p>

          {/* Receipt Section */}
          <div style={styles.receipt}>
            <div style={styles.row}>
              <span style={styles.label}>Transaction ID</span>
              <span style={styles.value}>{details.id}</span>
            </div>
            
            <div style={styles.divider}></div>

            <div style={styles.row}>
              <span style={styles.label}>Game</span>
              <span style={styles.value}>{gameName}</span> 
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Date & Time</span>
              <span style={styles.value}>
                {new Date(booking.date).toLocaleDateString()} at {booking.time}
              </span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Players</span>
              <span style={styles.value}>{booking.people || 1}</span>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Amount Paid</span>
              <span style={styles.totalValue}>₹{booking.price}</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => navigate("/my-bookings")} 
              style={styles.primaryButton}
            >
              View My Bookings
            </button>
            <button 
              onClick={() => navigate("/")} 
              style={styles.secondaryButton}
            >
              Back to Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const styles = {
  pageBackground: {
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "500px",
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "40px 30px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    textAlign: "center",
  },
  iconContainer: {
    width: "80px",
    height: "80px",
    backgroundColor: "#d1fae5",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 25px auto",
  },
  checkIcon: {
    width: "40px",
    height: "40px",
    color: "#059669",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1rem",
    marginBottom: "30px",
  },
  receipt: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "30px",
    border: "1px solid #e5e7eb",
    textAlign: "left",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  label: {
    color: "#6b7280",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  value: {
    color: "#374151",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "15px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: "#111827",
    fontWeight: "700",
    fontSize: "1rem",
  },
  totalValue: {
    color: "#10b981",
    fontWeight: "800",
    fontSize: "1.2rem",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  primaryButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "transparent",
    color: "#4b5563",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  errorCard: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
};

export default PaymentSuccess;