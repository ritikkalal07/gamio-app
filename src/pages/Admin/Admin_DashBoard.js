import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin_DashBoard() {
  const [userCount, setUserCount] = useState(0);
  const [venueCount, setVenueCount] = useState(0);

  // Fetch total users
  const fetchUserCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUserCount(res.data.length);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch total games/venues
  const fetchVenueCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/games");
      if (res.data.success && Array.isArray(res.data.games)) {
        setVenueCount(res.data.games.length);
      } else {
        setVenueCount(0);
      }
    } catch (err) {
      console.error("Error fetching venues:", err);
      setVenueCount(0);
    }
  };

  useEffect(() => {
    fetchUserCount();
    fetchVenueCount();
  }, []);

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>📊 Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, Admin!</span>
        </div>
      </header>

      <section className="stats-cards">
        <div className="card">
          <div className="card__icon"><i className="fas fa-dollar-sign"></i></div>
          <div className="card__info">
            <p>Total Revenue</p>
            <h3>₹1,25,500</h3>
          </div>
        </div>
        <div className="card">
          <div className="card__icon"><i className="fas fa-calendar-check"></i></div>
          <div className="card__info">
            <p>Total Bookings</p>
            <h3>84</h3>
          </div>
        </div>
        <div className="card">
          <div className="card__icon"><i className="fas fa-map-marker-alt"></i></div>
          <div className="card__info">
            <p>Listed Venues</p>
            <h3>{venueCount}</h3> {/* Dynamic venue count */}
          </div>
        </div>
        <div className="card">
          <div className="card__icon"><i className="fas fa-users"></i></div>
          <div className="card__info">
            <p>Registered Users</p>
            <h3>{userCount}</h3> {/* Dynamic user count */}
          </div>
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-container">
          <h3>Revenue Over Time</h3>
          <canvas id="revenueChart"></canvas>
        </div>
        <div className="chart-container">
          <h3>Bookings by Sport</h3>
          <canvas id="bookingsChart"></canvas>
        </div>
      </section>
    </main>
  );
}

export default Admin_DashBoard;
