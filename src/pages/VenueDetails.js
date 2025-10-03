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
            <h1 className="venue-details__title">{venue.name}</h1>
            <p className="venue-details__location">
              <i className="fas fa-map-marker-alt"></i> {venue.place}
            </p>

            <div className="venue__image-carousel">
              <img src={venue.photo} alt={venue.name} className="venue__main-image" />
            </div>

            <div className="venue-details__section">
              <h3>About this venue</h3>
              <p>{venue.description}</p>
            </div>

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

            <div className="venue-details__section">
              <Link to={`/book/${venue._id}`} className="btn btn--primary">Book a Slot</Link>
            </div>

            <div className="venue-details__section">
              <h3>Location</h3>
              <div className="map__container" style={{margintop:'2rem'}}>
                {/* <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(venue.place)}`}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Venue Location"
                ></iframe> */}
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117503.70428945415!2d72.4886674391604!3d23.02024345579973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1694709459051!5m2!1sen!2sin" width="100%" height="300" style={{border:'0'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

  
    </div>
  );
}

export default VenueDetails;
