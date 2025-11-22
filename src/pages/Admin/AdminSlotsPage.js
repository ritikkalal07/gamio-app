import React, { useEffect, useState } from "react";
import bookingService from "../bookingService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminSlotsPage() {
  const [games, setGames] = useState([]);
  const [venueId, setVenueId] = useState(""); // empty => show ALL slots
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [days, setDays] = useState(1);
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [slotDuration, setSlotDuration] = useState(60);
  const [price, setPrice] = useState(300);
  // location state remains but we'll auto-fill it from selected game.place
  const [location, setLocation] = useState("Ahmedabad");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch games list once
  useEffect(() => {
    bookingService
      .getVenues()
      .then((res) => {
        // backend may respond { games: [...] } or [...], handle both
        const list = res.data.games || res.data || [];
        setGames(list);
      })
      .catch((err) => {
        console.error("Error fetching games:", err);
        setGames([]);
      });
  }, []);

  // When venueId changes — auto-set location from the game's place (if present)
  useEffect(() => {
    if (!venueId) {
      // show all slots, keep default location (or clear)
      // don't override the user's manual location unless we found a game
      fetchSlots(); // load all
      return;
    }

    const selected = games.find((g) => String(g._id) === String(venueId));
    if (selected) {
      // use game's place field (you said model uses `place`)
      if (selected.place) setLocation(selected.place);
    }

    // fetch slots for selected venue
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId, games]);

  // Fetch slots function (robust)
  const fetchSlots = async () => {
    setLoading(true);
    try {
      // We rely on bookingService.adminGetSlots to accept either:
      // - a venueId path param (like /slots/admin/:venueId) OR
      // - if venueId is empty it should return all slots
      // Many server versions accept GET /api/slots/admin?venueId=... - if your bookingService uses that, it's fine.
      const res = await bookingService.adminGetSlots(venueId, token);
      const serverSlots = res.data.slots || [];
      setSlots(serverSlots);
    } catch (err) {
      console.error("Error fetching slots:", err);

      // fallback: try calling adminGetSlots with empty param (some clients require different shape)
      try {
        const res2 = await bookingService.adminGetSlots("", token);
        setSlots(res2.data.slots || []);
      } catch (fallbackErr) {
        console.error("Fallback fetch also failed:", fallbackErr);
        setSlots([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate slots
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!venueId) {
      Swal.fire("Select a venue first!", "", "warning");
      return;
    }

    // Ensure we use the selected game's place for location (do not rely on the manual `location` input)
    const selected = games.find((g) => String(g._id) === String(venueId));
    const payloadLocation = selected?.place || location || "Ahmedabad";

    const payload = {
      venueId,
      startDate,
      days: Number(days),
      openTime,
      closeTime,
      slotDurationMinutes: Number(slotDuration),
      price: Number(price),
      // enforce payload location from game.place
      location: payloadLocation,
    };

    try {
      setLoading(true);
      const res = await bookingService.adminCreateSlots(payload, token);

      const createdCount = res.data.created ?? 0;
      const createdSlots = res.data.slots || [];

      Swal.fire({
        icon: "success",
        title: "Slots Generated Successfully!",
        text: `${createdCount} new slots created.`,
        confirmButtonColor: "#4ECDC4",
      });

      // Immediately update UI:
      // If admin was viewing ALL slots, append created slots.
      // If admin was viewing slots for selected venue, append created slots too.
      setSlots((prev) => {
        // Avoid duplicates: create map of existing key (date+startTime+venueId)
        const key = (s) => `${String(s.venueId)}|${String(s.date)}|${s.startTime}`;
        const existingKeys = new Set(prev.map(key));
        const merged = [...prev];
        for (const cs of createdSlots) {
          if (!existingKeys.has(key(cs))) merged.push(cs);
        }
        // keep sorted by date,startTime
        merged.sort((a, b) => {
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          if (a.startTime < b.startTime) return -1;
          if (a.startTime > b.startTime) return 1;
          return 0;
        });
        return merged;
      });
    } catch (err) {
      console.error("Slot generation error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Slot generation failed.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete slot
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This slot will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#4ECDC4",
      confirmButtonText: "Yes, delete it!",
      background: "#f9fafb",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await bookingService.adminDeleteSlot(id, token);
          setSlots((prev) => prev.filter((s) => s._id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The slot has been removed successfully.",
            confirmButtonColor: "#4ECDC4",
          });
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Failed to delete slot.", "error");
        }
      }
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>🕒 Manage Slots</h2>
        <button style={styles.backBtn} onClick={() => navigate("/admin/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleGenerate} style={styles.formCard}>
        <h3 style={styles.sectionTitle}>Add / Generate Slots</h3>

        <div style={styles.row}>
          <div style={styles.field}>
            <label>🎮 Select Game / Venue</label>
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              style={styles.input}
            >
              <option value="">-- Show ALL Slots --</option>
              {games.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label>📅 Start Date</label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label>📆 Days</label>
            <input
              type="number"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label>🕘 Opening Time</label>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label>🕙 Closing Time</label>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label>⏱ Slot Duration (mins)</label>
            <input
              type="number"
              min="15"
              step="15"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label>💰 Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label>📍 Location (auto from game)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
              // still editable if admin wants to override — but default comes from selected game
            />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button type="submit" disabled={loading} style={styles.generateBtn}>
            {loading ? "Generating..." : "✨ Generate Slots"}
          </button>
        </div>
      </form>

      {/* SLOTS TABLE */}
      <div style={styles.tableCard}>
        <h3 style={styles.sectionTitle}>📋 Slots</h3>

        {loading ? (
          <p style={styles.loadingText}>Loading slots...</p>
        ) : slots.length === 0 ? (
          <p style={styles.noSlots}>⚠️ No slots found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Start</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Location</th>
                <th>Booked?</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {slots.map((s) => (
                <tr key={s._id}>
                  <td>{typeof s.date === "string" ? s.date : new Date(s.date).toISOString().split("T")[0]}</td>
                  <td>{s.startTime}</td>
                  <td>{s.slotDurationMinutes || s.slotDuration || "—"} min</td>
                  <td>₹{s.price}</td>
                  <td>{s.location || "—"}</td>
                  <td style={{ color: s.isBooked ? "#ef4444" : "#10b981", fontWeight: 600 }}>
                    {s.isBooked ? "Yes" : "No"}
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(s._id)}
                      disabled={s.isBooked}
                      style={{
                        ...styles.deleteBtn,
                        backgroundColor: s.isBooked ? "#9ca3af" : "#ef4444",
                        cursor: s.isBooked ? "not-allowed" : "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* STYLES (unchanged) */
const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "Poppins, sans-serif",
    color: "#01030aff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: { fontSize: "1.8rem", fontWeight: 600 },
  backBtn: {
    backgroundColor: "#4ECDC4",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
  },
  formCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "1.5rem 2rem",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    marginBottom: "2rem",
  },
  sectionTitle: { fontSize: "1.3rem", color: "#000000ff", marginBottom: "1rem" },
  row: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  field: { flex: "1 1 30%", display: "flex", flexDirection: "column" },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #93c5fd",
    fontSize: "1rem",
    marginTop: "6px",
    outline: "none",
  },
  generateBtn: {
    backgroundColor: "#4ECDC4",
    color: "#fff",
    padding: "12px 28px",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "8px",
    overflow: "hidden",
  },
  noSlots: {
    color: "#f59e0b",
    fontWeight: "500",
    textAlign: "center",
    padding: "1rem",
  },
  deleteBtn: {
    border: "none",
    color: "white",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "0.9rem",
  },
  loadingText: { textAlign: "center", color: "#6b7280" },
};

export default AdminSlotsPage;
