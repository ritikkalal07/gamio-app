import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  //  1. FETCH DATA 
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/bookings/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPayments(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token]);

  //  2. FILTER LOGIC 
  useEffect(() => {
    let result = payments;

    if (filterStatus !== "All") {
      result = result.filter((p) => {
        const status = p.paymentStatus || (p.status === "Confirmed" ? "Paid" : "Pending");
        return status === filterStatus;
      });
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          (p.transactionId || "").toLowerCase().includes(lower) ||
          p.username.toLowerCase().includes(lower) ||
          (p.venueId?.name || "").toLowerCase().includes(lower)
      );
    }

    setFilteredBookings(result);
  }, [payments, filterStatus, searchTerm]);


  //  3. EXCEL EXPORT 
  const exportToExcel = () => {
    const dataToExport = filteredPayments.map(p => ({
       "Transaction ID": p.transactionId || "N/A",
       "User": p.username,
       "Email": p.email,
       "Venue": p.venueId?.name || "N/A",
       "Date": new Date(p.date).toLocaleDateString(),
       "Amount": p.amountPaid || p.price, 
       "Status": p.paymentStatus || "Pending"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");
    XLSX.writeFile(workbook, `Gamio_Payments_${new Date().toISOString().split('T')[0]}.xlsx`);
  };


  //  4. REFUND ACTION 
  const handleRefund = async (bookingId) => {
    if (!window.confirm("⚠️ Confirm Refund? This action cannot be undone.")) return;

    try {
      await axios.post(
        "http://localhost:5000/api/payments/refund",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update Local State
      setPayments((prev) =>
        prev.map((p) =>
          p._id === bookingId ? { ...p, paymentStatus: "Refunded" } : p
        )
      );
      alert("Refund processed successfully.");
    } catch (err) {
      console.error(err);
      alert("Refund failed. Check console.");
    }
  };


  //  5. STATS CALCULATION 
  const totalRevenue = payments
    .filter(p => p.paymentStatus === "Paid" || p.status === "Confirmed")
    .reduce((acc, curr) => acc + (curr.price || 0), 0);
  
  const totalRefunded = payments
    .filter(p => p.paymentStatus === "Refunded")
    .reduce((acc, curr) => acc + (curr.price || 0), 0);


  return (
    <div style={styles.pageContainer}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Financial Dashboard</h1>
          <p style={styles.subtitle}>Track revenue, transactions, and refunds.</p>
        </div>
        <button style={styles.dashboardBtn} onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Revenue</span>
          <span style={{...styles.statValue, color: '#10b981'}}>₹{totalRevenue.toLocaleString()}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Refunded</span>
          <span style={{...styles.statValue, color: '#ef4444'}}>₹{totalRefunded.toLocaleString()}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Net Transactions</span>
          <span style={{...styles.statValue, color: '#3b82f6'}}>{payments.length}</span>
        </div>
      </div>

      {/* CONTROLS TOOLBAR */}
      <div style={styles.toolbar}>
        <div style={styles.searchContainer}>
           <input
            type="text"
            placeholder="🔍 Search Transaction ID, User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.actionsContainer}>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="All">All Transactions</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>

          <button onClick={exportToExcel} style={styles.exportBtn}>
             Download Excel 📥
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tHeadRow}>
              <th style={styles.th}>Transaction ID</th>
              <th style={styles.th}>User Details</th>
              <th style={styles.th}>Venue & Date</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="6" style={styles.loadingCell}>Loading records...</td></tr>
            ) : filteredPayments.length === 0 ? (
               <tr><td colSpan="6" style={styles.emptyCell}>No records found.</td></tr>
            ) : (
              filteredPayments.map((p) => {
                // Determine Status Display
                const displayStatus = p.paymentStatus || (p.status === "Confirmed" ? "Paid" : "Pending");
                const isPaid = displayStatus === "Paid";
                const isRefunded = displayStatus === "Refunded";

                return (
                  <tr key={p._id} style={styles.tRow}>
                    <td style={styles.td}>
                      <span style={styles.transId}>
                        {p.transactionId ? p.transactionId : "—"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{fontWeight: '600'}}>{p.username}</div>
                      <div style={{fontSize: '0.85rem', color: '#6b7280'}}>{p.email}</div>
                    </td>
                    <td style={styles.td}>
                      <div>{p.venueId?.name || "Unknown"}</div>
                      <div style={{fontSize: '0.85rem', color: '#6b7280'}}>{new Date(p.date).toLocaleDateString()}</div>
                    </td>
                    <td style={{...styles.td, fontWeight: '700'}}>
                       ₹{p.price}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: isPaid ? '#d1fae5' : isRefunded ? '#fee2e2' : '#f3f4f6',
                        color: isPaid ? '#065f46' : isRefunded ? '#991b1b' : '#374151',
                        border: isPaid ? '1px solid #a7f3d0' : isRefunded ? '1px solid #fecaca' : '1px solid #e5e7eb'
                      }}>
                        {displayStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                       {isPaid ? (
                         <button 
                           onClick={() => handleRefund(p._id)} 
                           style={styles.refundBtn}
                           title="Issue Refund"
                         >
                           Refund
                         </button>
                       ) : (
                         <span style={{color:'#ccc'}}>—</span>
                       )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

//  PROFESSIONAL STYLES 
const styles = {
  pageContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#1f2937",
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
    fontSize: "1rem",
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
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "1.8rem",
    fontWeight: "800",
  },

  // Toolbar
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  searchContainer: {
    flex: 1,
    minWidth: "250px",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  },
  actionsContainer: {
    display: "flex",
    gap: "1rem",
  },
  filterSelect: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#fff",
  },
  exportBtn: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  // Table
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },
  tHeadRow: {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#4b5563",
    textTransform: "uppercase",
  },
  tRow: {
    borderBottom: "1px solid #f3f4f6",
    transition: "background 0.2s",
  },
  td: {
    padding: "16px",
    fontSize: "0.95rem",
    color: "#1f2937",
    verticalAlign: "middle",
  },
  transId: {
    fontFamily: "monospace",
    backgroundColor: "#f3f4f6",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.85rem",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "50px",
    fontSize: "0.8rem",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  refundBtn: {
    backgroundColor: "#fff",
    color: "#dc2626",
    border: "1px solid #fca5a5",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.85rem",
    transition: "0.2s",
  },
  loadingCell: {
    padding: "2rem",
    textAlign: "center",
    color: "#6b7280",
  },
  emptyCell: {
    padding: "2rem",
    textAlign: "center",
    color: "#9ca3af",
    fontStyle: "italic",
  },
};

export default AdminPayments;