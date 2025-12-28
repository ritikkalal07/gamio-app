import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BookSlot() {
  const navigate = useNavigate();
  const { id } = useParams(); // Venue ID

  // --- STATE ---
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeSlot, setActiveSlot] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: localStorage.getItem("username") || "Guest User",
    email: localStorage.getItem("email") || "",
    phone: "",
    people: 1,
  });

  const minDate = new Date().toISOString().split("T")[0];

  // --- 1. FETCH SLOTS ---
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setMessage("");
        const correctDate = new Date(selectedDate).toISOString().split("T")[0];

        // API Call
        const response = await axios.get(
          `http://localhost:5000/api/slots/${id}?date=${correctDate}`
        );

        if (response.data.success && Array.isArray(response.data.slots)) {
          if (response.data.slots.length === 0) {
            setMessage(""); // No error, just empty
            setSlots([]);
          } else {
            setSlots(response.data.slots);
          }
        } else {
          setMessage("⚠️ No slots available. Please check again later.");
          setSlots([]);
        }
      } catch (err) {
        console.error(err);
        // Don't show error if it's just 404 (no slots found)
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [id, selectedDate]);

  // --- 2. HANDLE SELECTION ---
  const handleSlotClick = (slot) => {
    if (slot.isBooked) return alert("This slot is already booked!");
    
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login to book a slot.");
        navigate("/login");
        return;
    }
    
    setActiveSlot(slot);
    // Scroll to form (optional UX improvement)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "people" ? Number(value) : value,
    }));
  };

  const handleCancel = () => {
    setActiveSlot(null);
  };

  // --- 3. SUBMIT BOOKING & NAVIGATE ---
  const submitBooking = async (e) => {
    e.preventDefault();
    if (!activeSlot) return setMessage("No slot selected.");
    if (!formData.email || !formData.phone) return setMessage("Please fill all details.");

    setLoading(true);
    setMessage("Processing booking...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login to continue.");
        setLoading(false);
        return;
      }

      const bookingData = {
        username: formData.username,
        email: formData.email,
        venueId: id,
        date: selectedDate,
        time: activeSlot.startTime,
        people: formData.people,
        price: activeSlot.price,
      };

      const response = await axios.post(
        "http://localhost:5000/api/bookings/book",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

    if (response.data.success) {
      const booking = response.data.booking;
      
      navigate("/pay", {
        state: {
          bookingData: {
            _id: booking._id,
            venueId: id, 
            venueName: booking.venueName, 
            date: booking.date,
            time: booking.time,
            price: booking.price,
          }
        }
      });
} else {
        setMessage(response.data.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      if (err.response?.status === 401) {
        setMessage("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setMessage(err.response?.data?.message || "Failed to book slot.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        
        {/* --- LEFT SIDE: DATE & SLOTS --- */}
        <div style={styles.slotsSection}>
          <h2 style={styles.sectionTitle}>Select a Slot</h2>
          
          <div style={styles.dateContainer}>
            <label style={styles.label}>Pick a Date:</label>
            <input
              type="date"
              value={selectedDate}
              min={minDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={styles.dateInput}
            />
          </div>

          {loading && !activeSlot ? (
            <div style={styles.loading}>Loading available slots...</div>
          ) : slots.length === 0 ? (
            <div style={styles.noSlots}>
                <p>⚠️ No slots available for this date.</p>
                <small>Try selecting a different date.</small>
            </div>
          ) : (
            <div style={styles.grid}>
              {slots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleSlotClick(slot)}
                  disabled={slot.isBooked || loading}
                  style={{
                    ...styles.slotButton,
                    ...(slot.isBooked ? styles.bookedSlot : styles.availableSlot),
                    ...(activeSlot === slot ? styles.activeSlot : {}),
                  }}
                >
                  <span style={styles.timeText}>{slot.displayTime || slot.startTime}</span>
                  <span style={styles.priceText}>₹{slot.price}</span>
                  <span style={{fontSize: '0.75rem', marginTop: '4px'}}>
                    {slot.isBooked ? "Booked" : "Available"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: CONFIRMATION FORM --- */}
        {activeSlot && (
            <div style={styles.formSection}>
              <div style={styles.stickyCard}>
                <h3 style={styles.formTitle}>Confirm Booking</h3>
                
                <div style={styles.summaryBox}>
                    <p><strong>Date:</strong> {selectedDate}</p>
                    <p><strong>Time:</strong> {activeSlot.startTime}</p>
                    <p style={{color: '#4ECDC4', fontSize: '1.2rem', marginTop: '5px'}}>
                        <strong>Total: ₹{activeSlot.price}</strong>
                    </p>
                </div>

                <form onSubmit={submitBooking} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Name</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 9876543210"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>No. of People</label>
                    <input
                      type="number"
                      name="people"
                      min="1"
                      value={formData.people}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  {message && <p style={styles.errorMsg}>{message}</p>}

                  <div style={styles.buttonGroup}>
                    <button type="button" onClick={handleCancel} style={styles.cancelBtn}>
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} style={styles.submitBtn}>
                      {loading ? "Processing..." : "Proceed to Pay"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

      </div>
    </div>
  );
}

// --- INLINE STYLES ---
const styles = {
  pageBackground: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    alignItems: "flex-start",
  },
  // Left Side
  slotsSection: {
    flex: "2",
    minWidth: "320px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "20px",
  },
  dateContainer: {
    marginBottom: "20px",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
  },
  dateInput: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", // Responsive grid
    gap: "15px",
  },
  slotButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "15px 10px",
    borderRadius: "10px",
    border: "1px solid #eee",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minHeight: "80px",
  },
  availableSlot: {
    backgroundColor: "#fff",
    color: "#333",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  bookedSlot: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
    border: "1px solid #e5e7eb",
  },
  activeSlot: {
    backgroundColor: "#007bff",
    color: "#fff",
    borderColor: "#007bff",
    transform: "scale(1.05)",
    boxShadow: "0 5px 15px rgba(0, 123, 255, 0.3)",
  },
  timeText: {
    fontWeight: "bold",
    fontSize: "0.95rem",
    marginBottom: "4px",
  },
  priceText: {
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  noSlots: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
      backgroundColor: '#fff',
      borderRadius: '12px',
      border: '1px dashed #ccc'
  },
  loading: {
      textAlign: 'center',
      padding: '20px',
      color: '#666'
  },

  // Right Side (Form)
  formSection: {
    flex: "1",
    minWidth: "300px",
  },
  stickyCard: {
    position: "sticky",
    top: "20px",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  },
  formTitle: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#1a1a1a',
      fontSize: '1.4rem'
  },
  summaryBox: {
      backgroundColor: '#f0f9ff',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      borderLeft: '4px solid #007bff'
  },
  form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
  },
  inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
  },
  label: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#555'
  },
  input: {
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      transition: 'border-color 0.2s'
  },
  buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px'
  },
  submitBtn: {
      flex: 1,
      backgroundColor: '#10b981', // Green
      color: '#fff',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background 0.3s'
  },
  cancelBtn: {
      flex: 1,
      backgroundColor: '#ef4444', // Red
      color: '#fff',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1rem'
  },
  errorMsg: {
      color: 'red',
      fontSize: '0.9rem',
      textAlign: 'center',
      margin: 0
  }
};

export default BookSlot;