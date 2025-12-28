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
        setVenue(response.data.game || response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch venue details.");
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading)
    return (
      <div style={styles.centerContainer}>
        <p style={{ color: "#666", fontSize: "1.2rem" }}>Loading Venue...</p>
      </div>
    );

  if (error)
    return (
      <div style={styles.centerContainer}>
        <p style={{ color: "red", fontSize: "1.2rem" }}>{error}</p>
      </div>
    );

  if (!venue)
    return (
      <div style={styles.centerContainer}>
        <p>No venue found.</p>
      </div>
    );

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        
        {/* HEADER SECTION */}
        <header style={styles.header}>
          <h1 style={styles.title}>{venue.name}</h1>
          <p style={styles.location}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: "8px", color: "#4ECDC4" }}></i>
            {venue.place}
          </p>
        </header>

        {/* HERO IMAGE */}
        <div style={styles.imageContainer}>
          <img
            src={venue.photo || "https://via.placeholder.com/800x400?text=No+Image"}
            alt={venue.name}
            style={styles.image}
          />
        </div>

        {/* CONTENT SECTION */}
        <div style={styles.contentGrid}>
          {/* Left Column: Info */}
          <div style={styles.infoColumn}>
            
            {/* Description */}
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>About this venue</h3>
              <p style={styles.description}>
                {venue.description || "Play pool with friends in a cozy indoor environment."}
              </p>
            </section>

            {/* Amenities */}
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Amenities</h3>
              <div style={styles.amenitiesList}>
                <span style={styles.amenityItem}><i className="fas fa-parking" style={styles.icon}></i> Parking</span>
                <span style={styles.amenityItem}><i className="fas fa-shower" style={styles.icon}></i> Showers</span>
                <span style={styles.amenityItem}><i className="fas fa-wifi" style={styles.icon}></i> Free Wi-Fi</span>
                <span style={styles.amenityItem}><i className="fas fa-lightbulb" style={styles.icon}></i> Floodlights</span>
                <span style={styles.amenityItem}><i className="fas fa-tint" style={styles.icon}></i> Drinking Water</span>
              </div>
            </section>
          </div>

          {/* Right Column (or Bottom): Action Button */}
          <div style={styles.actionColumn}>
             <div style={styles.bookCard}>
                <p style={{marginBottom: '1rem', color: '#555'}}>Ready to play?</p>
                <Link to={`/book/${venue._id}`} style={styles.bookButton}>
                  Book a Slot
                </Link>
             </div>
          </div>
        </div>

        {/* MAP SECTION */}
        <section style={{ ...styles.section, marginTop: "2rem" }}>
          <h3 style={styles.sectionTitle}>Location</h3>
          <div style={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117503.70428945415!2d72.4886674391604!3d23.02024345579973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1694709459051!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue Location"
            ></iframe>
          </div>
        </section>

      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    backgroundColor: "#f8f9fa", 
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  centerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "10px",
  },
  location: {
    fontSize: "1.1rem",
    color: "#666",
    display: "flex",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: "400px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    marginBottom: "40px",
    backgroundColor: "#ddd",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  contentGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    marginBottom: "40px",
  },
  infoColumn: {
    flex: "2",
    minWidth: "300px",
  },
  actionColumn: {
    flex: "1",
    minWidth: "250px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "15px",
  },
  description: {
    lineHeight: "1.6",
    color: "#555",
    fontSize: "1.05rem",
  },
  amenitiesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },
  amenityItem: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "10px 18px",
    borderRadius: "50px",
    border: "1px solid #e0e0e0",
    color: "#444",
    fontSize: "0.95rem",
    fontWeight: "500",
    boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
  },
  icon: {
    color: "#4ECDC4", // Brand color
    marginRight: "8px",
  },
  bookCard: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      textAlign: 'center',
      width: '100%'
  },
  bookButton: {
    display: "inline-block",
    backgroundColor: "#4ECDC4", // Primary Blue
    color: "#fff",
    padding: "14px 30px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
    transition: "background-color 0.3s",
    width: "100%",
    textAlign: "center"
  },
  mapContainer: {
    width: "100%",
    height: "350px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #ddd",
    backgroundColor: "#eee",
  },
};

export default VenueDetails;