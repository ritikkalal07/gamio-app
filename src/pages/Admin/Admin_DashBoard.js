import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Admin_DashBoard() {
  const [stats, setStats] = useState({
    users: 0,
    venues: 0,
    bookings: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });
  const [sportData, setSportData] = useState({ labels: [], datasets: [] });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch All Data in Parallel
        const [usersRes, gamesRes, bookingsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/games"), // Public endpoint usually
          axios.get("http://localhost:5000/api/bookings/all", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const users = usersRes.data || [];
        const venues = gamesRes.data.games || [];
        const bookings = bookingsRes.data.bookings || [];

        // 2. Calculate KPI Stats
        const activeBookings = bookings.filter((b) => b.status !== "Cancelled");
        const totalRev = activeBookings.reduce((acc, curr) => acc + (curr.price || 0), 0);

        setStats({
          users: users.length,
          venues: venues.length,
          bookings: bookings.length, 
          revenue: totalRev,
        });

        // 3. Process Data for REVENUE CHART (Line Chart)
        const revenueByDate = {};
        activeBookings.forEach((b) => {
          const dateLabel = new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          revenueByDate[dateLabel] = (revenueByDate[dateLabel] || 0) + b.price;
        });

        const sortedDates = Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b));

        setRevenueData({
          labels: sortedDates,
          datasets: [
            {
              label: "Revenue (₹)",
              data: sortedDates.map((date) => revenueByDate[date]),
              borderColor: "#4ECDC4",
              backgroundColor: "rgba(78, 205, 196, 0.2)",
              tension: 0.4, 
              fill: true,
            },
          ],
        });

        // 4. Process Data for POPULARITY CHART (Doughnut)
        const bookingsByVenue = {};
        bookings.forEach((b) => {
          const venueName = b.venueId?.name || "Unknown";
          bookingsByVenue[venueName] = (bookingsByVenue[venueName] || 0) + 1;
        });

        setSportData({
          labels: Object.keys(bookingsByVenue),
          datasets: [
            {
              label: "# of Bookings",
              data: Object.values(bookingsByVenue),
              backgroundColor: [
                "#FF6B6B",
                "#4ECDC4",
                "#FFE66D",
                "#1A535C",
                "#F7FFF7",
                "#555555",
              ],
              borderWidth: 1,
            },
          ],
        });

      } catch (err) {
        console.error("Dashboard Data Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <main style={styles.mainContent}>
      <header style={styles.header}>
        <h1 style={styles.pageTitle}>📊 Admin Dashboard</h1>
        <div style={styles.welcomeBadge}>Welcome, Admin</div>
      </header>

      {/*  STATS CARDS SECTION  */}
      <section style={styles.statsGrid}>
        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: "#d1fae5", color: "#065f46" }}>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div>
            <p style={styles.cardLabel}>Total Revenue</p>
            <h3 style={styles.cardValue}>
              {loading ? "..." : `₹${stats.revenue.toLocaleString()}`}
            </h3>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: "#dbeafe", color: "#1e40af" }}>
            <i className="fas fa-calendar-check"></i>
          </div>
          <div>
            <p style={styles.cardLabel}>Total Bookings</p>
            <h3 style={styles.cardValue}>{loading ? "..." : stats.bookings}</h3>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: "#fef3c7", color: "#92400e" }}>
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div>
            <p style={styles.cardLabel}>Listed Venues</p>
            <h3 style={styles.cardValue}>{loading ? "..." : stats.venues}</h3>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.iconBox, background: "#f3f4f6", color: "#374151" }}>
            <i className="fas fa-users"></i>
          </div>
          <div>
            <p style={styles.cardLabel}>Registered Users</p>
            <h3 style={styles.cardValue}>{loading ? "..." : stats.users}</h3>
          </div>
        </div>
      </section>

      {/*  CHARTS SECTION  */}
      <section style={styles.chartsGrid}>
        
        {/* Revenue Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>📈 Revenue Over Time</h3>
          <div style={styles.chartContainer}>
            {!loading && revenueData.labels.length > 0 ? (
              <Line 
                data={revenueData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } }
                }} 
              />
            ) : (
              <p style={styles.noDataText}>No revenue data yet.</p>
            )}
          </div>
        </div>

        {/* Popularity Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>🏟️ Bookings by Venue</h3>
          <div style={styles.chartContainer}>
             {!loading && sportData.labels.length > 0 ? (
              <Doughnut 
                data={sportData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'right' } }
                }}
              />
             ) : (
               <p style={styles.noDataText}>No booking data yet.</p>
             )}
          </div>
        </div>

      </section>
    </main>
  );
}

const styles = {
  mainContent: {
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "1.8rem",
    color: "#1f2937",
    fontWeight: "700",
  },
  welcomeBadge: {
    padding: "8px 16px",
    backgroundColor: "#1f2937",
    color: "#fff",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  
  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    border: "1px solid #f3f4f6",
  },
  iconBox: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
  },
  cardLabel: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  cardValue: {
    margin: "5px 0 0 0",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#111827",
  },

  // Charts Grid
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "1.5rem",
  },
  chartCard: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid #f3f4f6",
    height: "400px", // Fixed height for container
    display: "flex",
    flexDirection: "column",
  },
  chartTitle: {
    margin: "0 0 1.5rem 0",
    fontSize: "1.1rem",
    color: "#374151",
    fontWeight: "600",
  },
  chartContainer: {
    flex: 1,
    position: "relative",
    width: "100%",
  },
  noDataText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: "20%",
  },
};

export default Admin_DashBoard;