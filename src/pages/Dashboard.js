import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("upcoming-bookings");
  const [user, setUser] = useState({ name: "", email: "" });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // 1. Fetch User Profile (Assuming you have an endpoint for this, or using localStorage)
        // If you don't have a specific /me endpoint, we can use localStorage for basic info
        const storedName = localStorage.getItem("username") || "";
        const storedEmail = localStorage.getItem("email") || "";
        setUser({ name: storedName, email: storedEmail });

        // 2. Fetch Bookings
        const res = await axios.get("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // --- HELPERS ---

  // Separate bookings into Upcoming and Past
  const now = new Date();
  const upcomingBookings = bookings.filter((b) => new Date(b.date) >= now);
  const pastBookings = bookings.filter((b) => new Date(b.date) < now);

  // Handle Cancel
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        alert("Booking cancelled successfully.");
      }
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };

  // Handle Profile Update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Here you would typically make a PUT request to update the user
    // For now, we'll just update localStorage as a demo
    localStorage.setItem("username", user.name);
    setSuccessMsg("Profile updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  if (loading) return <div className="section container"><p>Loading Dashboard...</p></div>;

  return (
    <main>
      <section className="section container">
        <div className="page__header">
          <h1 className="page__title">My Dashboard</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
        </div>

        <div className="dashboard__layout">
          {/* --- TABS --- */}
          <div className="dashboard__tabs">
            <button
              className={`tab__link ${activeTab === "upcoming-bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming-bookings")}
            >
              Upcoming Bookings
            </button>
            <button
              className={`tab__link ${activeTab === "booking-history" ? "active" : ""}`}
              onClick={() => setActiveTab("booking-history")}
            >
              Booking History
            </button>
            <button
              className={`tab__link ${activeTab === "profile-settings" ? "active" : ""}`}
              onClick={() => setActiveTab("profile-settings")}
            >
              Profile Settings
            </button>
          </div>

          {/* --- CONTENT AREA --- */}
          <div className="dashboard__content">
            
            {/* 1. UPCOMING BOOKINGS TAB */}
            {activeTab === "upcoming-bookings" && (
              <div className="tab__content active">
                <h3>Your Upcoming Games</h3>
                {upcomingBookings.length === 0 ? (
                  <p>No upcoming games scheduled.</p>
                ) : (
                  upcomingBookings.map((booking) => (
                    <div className="booking__item" key={booking._id}>
                      <div className="booking__details">
                        {/* Accessing populated venue data safely */}
                        <h4>{booking.venueId?.name || "Unknown Venue"} - {booking.venueId?.category || "Sport"}</h4>
                        <p>
                          <i className="fas fa-calendar-alt"></i>{" "}
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p>
                          <i className="fas fa-clock"></i> {booking.time}
                        </p>
                        <p>
                          <strong>Price:</strong> ₹{booking.price} ({booking.people} Players)
                        </p>
                      </div>
                      
                      {booking.status !== "Cancelled" ? (
                        <button
                          className="btn btn--outline"
                          style={{
                            color: "var(--accent-coral)",
                            borderColor: "var(--accent-coral)",
                          }}
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      ) : (
                        <span style={{ color: "red", fontWeight: "bold" }}>Cancelled</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. PAST BOOKINGS TAB */}
            {activeTab === "booking-history" && (
              <div className="tab__content active">
                <h3>Your Past Games</h3>
                {pastBookings.length === 0 ? (
                  <p>No past games found.</p>
                ) : (
                  pastBookings.map((booking) => (
                    <div className="booking__item" key={booking._id}>
                      <div className="booking__details">
                        <h4>{booking.venueId?.name || "Unknown Venue"}</h4>
                        <p>
                          <i className="fas fa-calendar-alt"></i>{" "}
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p>
                          <i className="fas fa-check-circle"></i> Completed
                        </p>
                      </div>
                      <button 
                        className="btn btn--secondary"
                        onClick={() => navigate("/book")} // Or navigate to specific venue page
                      >
                        Book Again
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. PROFILE SETTINGS TAB */}
            {activeTab === "profile-settings" && (
              <div className="tab__content active">
                <h3>Update Your Profile</h3>
                <form onSubmit={handleProfileUpdate}>
                  <div className="form__group">
                    <label htmlFor="dash-name">Full Name</label>
                    <input
                      type="text"
                      id="dash-name"
                      className="form__input"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </div>
                  <div className="form__group">
                    <label htmlFor="dash-email">Email</label>
                    <input
                      type="email"
                      id="dash-email"
                      className="form__input"
                      value={user.email}
                      disabled
                      title="Email cannot be changed"
                    />
                  </div>
                  <button className="btn btn--primary" type="submit">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;