import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/games/${id}`);
        setVenue(response.data.game);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch venue details. Please try again.");
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!venue) return <div className="no-venue">No venue found.</div>;

  return (
    <div className="venue-details-page">
      <main className="main container">
        <section className="venue-details__layout">
          <div className="venue-details__main">
            {/* ✅ Title and Location */}
            <h1 className="venue-details__title">{venue.name}</h1>
            <p className="venue-details__location">
              <i className="fas fa-map-marker-alt"></i> {venue.place}
            </p>

            {/* ✅ Image */}
            <div className="venue__image-carousel" style={{ marginBottom: "1.5rem" }}>
              <img
                src={venue.photo}
                alt={venue.name}
                className="venue__main-image"
                style={{
                  width: "100%",
                  maxHeight: "350px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>

            {/* ✅ About */}
            <div className="venue-details__section">
              <h3>About this venue</h3>
              <p>{venue.description}</p>
            </div>

            {/* ✅ Amenities */}
            <div className="venue-details__section">
              <h3>Amenities</h3>
              <ul className="amenities__list">
                <li><i className="fas fa-parking"></i> Parking</li>
                <li><i className="fas fa-shower"></i> Showers</li>
                <li><i className="fas fa-wifi"></i> Free Wi-Fi</li>
                <li><i className="fas fa-lightbulb"></i> Floodlights</li>
                <li><i className="fas fa-tint"></i> Drinking Water</li>
              </ul>
            </div>

            {/* ✅ Buttons Section */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "2rem",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Book a Slot */}
              <Link
                to={`/book/${venue._id}`}
                className="btn btn--primary"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "500",
                  minWidth: "150px",
                  textAlign: "center",
                  transition: "0.3s",
                }}
              >
                Book a Slot
              </Link>

              {/* ✅ View My Bookings — NEW BUTTON */}
              <Link
                to="/my-bookings"
                className="btn"
                style={{
                  backgroundColor: "#10b981",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "500",
                  minWidth: "150px",
                  textAlign: "center",
                  transition: "0.3s",
                }}
              >
                View My Bookings
              </Link>
            </div>

            {/* ✅ Map */}
            <div className="venue-details__section" style={{ marginTop: "3rem" }}>
              <h3>Location</h3>
              <div className="map__container" style={{ marginTop: "1.5rem" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117503.70428945415!2d72.4886674391604!3d23.02024345579973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1694709459051!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: "0", borderRadius: "8px" }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Venue Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default VenueDetails;
