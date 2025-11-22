import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BookingForm() {
  const { id, time, price } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
    phone: "",
    people: 1,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Please login to continue.");

    const bookingData = {
      username: formData.username,
      email: formData.email,
      venue: id,
      date: new Date().toISOString().split("T")[0],
      time,
      location: "Ahmedabad",
      people: Number(formData.people),
      price: Number(price),
    };

    try {
      setLoading(true);
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
        setConfirmed(true);
        setMessage("Booking successful!");
      } else {
        setMessage(response.data.message || "Failed to book slot.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>🎉 Booking Confirmed!</h2>
        <p>Your slot at {time} has been successfully booked.</p>
        <button onClick={() => navigate("/my-bookings")}>View My Bookings</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Confirm Booking</h2>
      <p><strong>Slot:</strong> {time}</p>
      <p><strong>Price:</strong> ₹{price}</p>

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>People:</label>
        <input type="number" name="people" min="1" value={formData.people} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>

      {message && <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>}
    </div>
  );
}

export default BookingForm;
