import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin_Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  //  1. FETCH BOOKINGS 
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/bookings/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBookings(res.data.bookings || []);
      setFilteredBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  //  2. HANDLE SEARCH & FILTER 
  useEffect(() => {
    let result = bookings;

    // Filter by Status
    if (statusFilter !== "All") {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Filter by Search (Name, Email, or Venue Name)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.username.toLowerCase().includes(lowerTerm) ||
          b.email.toLowerCase().includes(lowerTerm) ||
          (b.venueId?.name || "").toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredBookings(result);
  }, [searchTerm, statusFilter, bookings]);

  //  3. ADMIN ACTIONS 

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to CANCEL this booking?")) return;

    try {
     
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/cancel`, 
        { status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update UI locally
      const updated = bookings.map((b) => 
        b._id === id ? { ...b, status: "Cancelled" } : b
      );
      setBookings(updated);
      alert("Booking Cancelled.");
    } catch (err) {
      console.error("Error cancelling:", err);
      // Fallback: If no dedicated cancel route, try DELETE route logic if that is your preference
      alert("Could not update status. Check console.");
    }
  };

  // Delete Booking (Hard Delete)
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ This will PERMANENTLY delete the record. Continue?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from UI
      const remaining = bookings.filter((b) => b._id !== id);
      setBookings(remaining);
    } catch (err) {
      alert("Failed to delete booking.");
    }
  };

  //  STATS CALCULATION 
  const totalRevenue = bookings.reduce((acc, curr) => {
     return curr.status !== "Cancelled" ? acc + (curr.price || 0) : acc;
  }, 0);
  const activeBookings = bookings.filter(b => b.status === "Confirmed").length;

  return (
    <div style={styles.pageContainer}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Booking Manager</h1>
          <p style={styles.subtitle}>Manage all user reservations and payments.</p>
        </div>
        <button style={styles.dashboardBtn} onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {/* STATS BAR */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Bookings</span>
          <span style={styles.statValue}>{bookings.length}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Active Games</span>
          <span style={{...styles.statValue, color: '#10b981'}}>{activeBookings}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Revenue</span>
          <span style={{...styles.statValue, color: '#4ECDC4'}}>₹{totalRevenue}</span>
        </div>
      </div>

      {/* FILTERS TOOLBAR */}
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="🔍 Search user, email, or venue..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* BOOKINGS GRID */}
      <div style={styles.grid}>
        {loading ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>Loading data...</p>
        ) : filteredBookings.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: '#888' }}>
            No bookings matching your filters.
          </p>
        ) : (
          filteredBookings.map((b) => (
            <div key={b._id} style={styles.card}>
              
              {/* Card Header: Date & Status */}
              <div style={styles.cardHeader}>
                <span style={styles.dateBadge}>
                  {new Date(b.date).toLocaleDateString()}
                </span>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      b.status === "Cancelled" ? "#fee2e2" : 
                      b.status === "Pending" ? "#fef3c7" : "#d1fae5",
                    color:
                      b.status === "Cancelled" ? "#991b1b" : 
                      b.status === "Pending" ? "#92400e" : "#065f46",
                  }}
                >
                  {b.status}
                </span>
              </div>

              {/* Card Body: Details */}
              <div style={styles.cardBody}>
                <h3 style={styles.venueName}>{b.venueId?.name || "Unknown Venue"}</h3>
                <p style={styles.detailRow}>
                   <span>User:</span> <strong>{b.username}</strong>
                </p>
                <p style={styles.detailRow}>
                   <span>Email:</span> <span style={{fontSize:'0.9rem'}}>{b.email}</span>
                </p>
                <p style={styles.detailRow}>
                   <span>Time:</span> {b.time} ({b.people} ppl)
                </p>
                <p style={styles.priceRow}>
                   <span>Total:</span> <span>₹{b.price}</span>
                </p>
              </div>

              {/* Card Footer: Actions */}
              <div style={styles.cardFooter}>
                {b.status !== "Cancelled" && (
                  <button 
                    onClick={() => handleCancel(b._id)} 
                    style={styles.actionBtnCancel}
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(b._id)} 
                  style={styles.actionBtnDelete}
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#6b7280",
  },
  dashboardBtn: {
    backgroundColor: "#1f2937",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  
  // Stats
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },
  statLabel: {
    display: "block",
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: "5px",
  },
  statValue: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#111827",
  },

  // Toolbar
  toolbar: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    minWidth: "250px",
  },
  filterSelect: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    cursor: "pointer",
  },

  // Grid & Card
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    padding: "1rem",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateBadge: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "0.8rem",
    textTransform: "uppercase",
  },
  cardBody: {
    padding: "1rem",
    flex: 1,
  },
  venueName: {
    fontSize: "1.2rem",
    color: "#111827",
    margin: "0 0 1rem 0",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    color: "#4b5563",
    marginBottom: "8px",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#10b981",
    marginTop: "15px",
    borderTop: "1px dashed #e5e7eb",
    paddingTop: "10px",
  },
  cardFooter: {
    padding: "1rem",
    backgroundColor: "#f9fafb",
    display: "flex",
    gap: "10px",
  },
  actionBtnCancel: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #fca5a5",
    backgroundColor: "#fff",
    color: "#dc2626",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },
  actionBtnDelete: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#4b5563",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },
};

export default Admin_Bookings;