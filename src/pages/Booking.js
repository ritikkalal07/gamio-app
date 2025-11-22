import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    venue: "",
    date: "",
    time: "",
    location: "",
    people: 1,
    price: 0,
    status: "Confirmed",
  });

  const API_URL = "http://localhost:5000/api/bookings";

  //  Load user details
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("email");
      const username = localStorage.getItem("username");

      if (!token) {
        setError("Please log in to view or make bookings.");
        navigate("/login");
        return;
      }

      if (storedEmail) {
        setForm((prev) => ({
          ...prev,
          email: storedEmail,
          username: username,
        }));
      }
    } catch (err) {
      console.error("Error loading user:", err);
    }
  }, []);

  //  Fetch all games
  const fetchGames = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/games");
      if (res.data.success) setGames(res.data.games);
      else throw new Error("Failed to fetch games");
    } catch (err) {
      console.error(err);
    }
  }, []);

  //  Fetch bookings for current user
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("email");

      if (!token || !storedEmail) {
        setError("Please log in to view your bookings.");
        setBookings([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}?email=${storedEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const cleaned = res.data.bookings.map((b) => ({
          ...b,
          username: b.username || "",
          email: b.email || "",
          location: b.location || "",
          time: b.time || "",
          date: b.date || "",
          venue: b.venue?._id ? b.venue : { _id: b.venue, name: b.venueName || "Unknown Venue" },
          status: b.status || "Confirmed",
          people: b.people || 1,
          price: b.price || 0,
        }));
        setBookings(cleaned);
        setError(null);
      } else {
        setError("Failed to fetch your bookings.");
      }
    } catch (err) {
      setError("Error fetching bookings: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  //  Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "venue") {
      const selectedGame = games.find((g) => g._id === value);
      setForm((prev) => ({
        ...prev,
        venue: value,
        price: selectedGame ? selectedGame.price * prev.people : 0,
      }));
    } else if (name === "people") {
      const count = parseInt(value) || 1;
      const selectedGame = games.find((g) => g._id === form.venue);
      setForm((prev) => ({
        ...prev,
        people: count,
        price: selectedGame ? selectedGame.price * count : 0,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const convertTo12Hour = (hour, minute) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, "0");
    return `${h}:${m} ${ampm}`;
  };

  //  Submit Booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");

    if (!token || !storedEmail) {
      alert("Please log in before booking!");
      navigate("/login");
      return;
    }

    const { username, venue, date, time, location } = form;
    if (!username || !venue || !date || !time || !location) {
      alert("Please fill all fields before submitting!");
      return;
    }

    const selectedGame = games.find((g) => g._id === venue);
    const gameLocation = (selectedGame?.place || "").trim().toLowerCase();
    const userLocation = location.toLowerCase();

    if (
      selectedGame &&
      gameLocation &&
      !gameLocation.includes(userLocation) &&
      !userLocation.includes(gameLocation)
    ) {
      return alert(
        `This game is not available at "${location}". Available only at "${selectedGame.place}".`
      );
    }

    //  Check for time conflict
    const conflict = bookings.find(
      (b) =>
        (b.location || "").trim().toLowerCase() === userLocation &&
        (b.date || "") === date &&
        (b.time || "") === time &&
        b._id !== editingId
    );
    if (conflict && !editingId) {
      return alert(
        "⛔ That time is not allowed as another user has already booked. Please choose another time."
      );
    }

    try {
      const method = editingId ? "put" : "post";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await axios({
        method,
        url,
        data: {
          ...form,
          email: storedEmail,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert(editingId ? "Booking updated!" : "Booking added!");
        setForm({
          username: localStorage.getItem("username") || "",
          email: storedEmail,
          venue: "",
          date: "",
          time: "",
          location: "",
          people: 1,
          price: 0,
          status: "Confirmed",
        });
        setEditingId(null);
        fetchBookings();
      } else {
        alert("Operation failed: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
  const backendMsg = err.response?.data?.message;
  if (backendMsg) {
    alert("⛔ " + backendMsg);
  } else {
    alert("Operation failed: " + err.message);
  }
}
  };

  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const value = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      const label = convertTo12Hour(h, m);
      timeOptions.push({ value, label });
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete booking: " + err.message);
    }
  };

  return (
    <main className="section container">
      <div className="page__header">
        <h1 className="page__title">
          {editingId ? "Edit Booking" : "Add Booking"}
        </h1>
        <p className="page__subtitle">
          Fill in your details to confirm your booking.
        </p>
      </div>

      <div className="listing__layout">
        {/* Booking Form */}
        <aside className="listing__filters">
          <h3 className="filter__title">
            {editingId ? "Edit Booking" : "Add Booking"}
          </h3>

          <form className="auth__form" onSubmit={handleSubmit}>
            <div className="form__group">
              <label>Username</label>
              <input
                name="username"
                placeholder="Enter Username"
                className="form__input"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form__group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email (auto-filled)"
                className="form__input"
                value={form.email}
                readOnly
              />
            </div>

            <div className="form__group">
              <label>Venue/Game</label>
              <select
                name="venue"
                className="form__input"
                value={form.venue}
                onChange={handleChange}
                required
              >
                <option value="">Select a venue</option>
                {games.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <label>Location</label>
              <input
                name="location"
                placeholder="Enter Location"
                className="form__input"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form__group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                className="form__input"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form__group">
              <label>Time</label>
              <select
                name="time"
                className="form__input"
                value={form.time}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                {timeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <label>Number of People</label>
              <input
                type="number"
                name="people"
                min="1"
                className="form__input"
                value={form.people}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form__group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                className="form__input"
                value={form.price}
                readOnly
              />
            </div>

            <div className="form__group">
              <label>Status</label>
              <select
                name="status"
                className="form__input"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              style={{ width: "100%" }}
            >
              {editingId ? "Update Booking" : "Save Booking"}
            </button>
          </form>
        </aside>

        {/* Booking List */}
        <div className="listing__grid">
          {loading ? (
            <p style={{ textAlign: "center", opacity: 0.7 }}>Loading...</p>
          ) : error ? (
            <p style={{ textAlign: "center", opacity: 0.7 }}>{error}</p>
          ) : bookings.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.7 }}>
              No bookings found.
            </p>
          ) : (
            bookings.map((b) => (
              <div className="venue__card" key={b._id}>
                <div className="venue__card-content">
                  <div className="venue__card-header">
                    <h3 className="venue__title">User: {b.username || localStorage.getItem("username")}</h3>
                    <span className="venue__price">₹{b.price}</span>
                  </div>
                  <p className="venue__location">Email: {b.email}</p>
                  <p className="venue__location">
                    Venue: {b.venue?.name || "Unknown Venue"}
                  </p>
                  <p className="venue__location">Location: {b.location}</p>
                  <p className="venue__location">
                    Date: {new Date(b.date).toLocaleDateString()}
                  </p>
                  <p className="venue__location">Time: {b.time}</p>
                  <p className="venue__location">Status: {b.status}</p>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      className="btn btn--secondary"
                      onClick={() => {
                        setForm({
                          username: b.username,
                          email: b.email,
                          venue: b.venue?._id || b.venue,
                          date: b.date.split("T")[0],
                          time: b.time,
                          location: b.location,
                          people: b.people || 1,
                          price: b.price,
                          status: b.status,
                        });
                        setEditingId(b._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn--outline"
                      onClick={() => handleDelete(b._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Booking;
