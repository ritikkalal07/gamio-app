import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/bookings").then((res) => {
      setPayments(res.data.bookings);
    });
  }, []);

  // Filter + Search Logic
  const filteredPayments = payments.filter((payment) => {
    const matchesFilter =
      filter === "All" || payment.paymentStatus === filter;

    const searchLower = search.toLowerCase();
    const matchesSearch =
      payment.username?.toLowerCase().includes(searchLower) ||
      payment.venueId?.name?.toLowerCase().includes(searchLower) ||
      payment.date?.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  // Excel Export
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPayments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "Payments_Report.xlsx");
  };

  // Refund Logic
  const handleRefund = async (bookingId) => {
    const confirm = window.confirm("Are you sure you want to mark this as REFUNDED?");
    if (!confirm) return;

    await axios.post("http://localhost:5000/api/payment/refund", { bookingId });

    setPayments((prev) =>
      prev.map((p) =>
        p._id === bookingId ? { ...p, paymentStatus: "Refunded" } : p
      )
    );

    alert("Refund processed.");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Payment Management</h2>

      {/* Filters */}
      <div style={{ margin: "1rem 0" }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name, date, venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginLeft: "1rem", padding: "5px" }}
        />

        {/* Export Button */}
        <button
          onClick={exportToExcel}
          style={{
            marginLeft: "1rem",
            padding: "5px 15px",
            background: "#1d4ed8",
            color: "white",
          }}
        >
          Export Excel
        </button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Transaction ID</th>
            <th>Refund</th>
          </tr>
        </thead>

        <tbody>
          {filteredPayments.map((p) => (
            <tr key={p._id}>
              <td>{p.username}</td>
              <td>{p.venueId?.name}</td>
              <td>{p.date}</td>
              <td>₹{p.price}</td>

              <td
                style={{
                  color:
                    p.paymentStatus === "Paid"
                      ? "green"
                      : p.paymentStatus === "Failed"
                      ? "red"
                      : p.paymentStatus === "Refunded"
                      ? "orange"
                      : "gray",
                }}
              >
                {p.paymentStatus}
              </td>

              <td>{p.transactionId || "—"}</td>

              <td>
                {p.paymentStatus === "Paid" ? (
                  <button
                    onClick={() => handleRefund(p._id)}
                    style={{ background: "orange", padding: "5px" }}
                  >
                    Refund
                  </button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPayments;
