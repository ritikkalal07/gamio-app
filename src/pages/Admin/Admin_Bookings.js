import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin_Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/bookings/all", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Poppins, sans-serif",
        color: "#000000ff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: 600 }}>📋 Manage Bookings</h1>
        <button
          style={{
            backgroundColor: "#4ECDC4",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/admin/dashboard")}
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {loading ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>No bookings found.</p>
        ) : (
          bookings.map((b, i) => (
            <div
              key={b._id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 8px 20px rgba(78,205,196,0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <h3 style={{ margin: 0 }}>{b.username}</h3>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    backgroundColor:
                      b.status === "Cancelled"
                        ? "#ef4444"
                        : b.status === "Pending"
                        ? "#f59e0b"
                        : "#4ECDC4",
                  }}
                >
                  {b.status}
                </span>
              </div>

              <p style={{ margin: "2px 0" }}>
                <strong>Email:</strong> {b.email}
              </p>
              {/* <p style={{ margin: "2px 0" }}>
<p style={{ margin: "2px 0" }}>
  <strong>Phone:</strong> {b.phone?.trim() ? b.phone : "Not Provided"}
</p>

              </p> */}
              <p style={{ margin: "2px 0" }}>
                <strong>Venue:</strong> {b.venue?.name || "—"}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Date & Time:</strong>{" "}
                {new Date(b.date).toLocaleDateString()} @ {b.time}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>People:</strong> {b.people}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Total Price:</strong> ₹{b.price * (b.people || 1)}
              </p>

              {/* Placeholder for future actions */}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                {/* Example: Cancel or Edit buttons */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin_Bookings;
