import React, { useState } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to backend
      await axios.post("http://localhost:5000/api/contact", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Something went wrong!");
    }
  };

  return (
            <main>
            <section className="section container">
                <div className="page__header">
                <h1 className="page__title">Get In Touch</h1>
                <p className="page__subtitle">
                    We'd love to hear from you. Send us a message!
                </p>
                </div>
                <div className="contact__layout">
                <div className="contact__form-container">
                    <form onSubmit={handleSubmit}>
                    <div className="form__group">
                        <label htmlFor="name">Name</label>
                        <input
                        type="text"
                        id="name"
                        className="form__input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className="form__group">
                        <label htmlFor="email">Email</label>
                        <input
                        type="email"
                        id="email"
                        className="form__input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className="form__group">
                        <label htmlFor="message">Message</label>
                        <textarea
                        id="message"
                        className="form__input"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn--primary">
                        Send Message
                    </button>
                    </form>
                </div>
   
                <div className="contact__info">
                    <h3>Contact Information</h3>
                    <p>Reach out to us directly or visit our office.</p>
                    <div className="info__item"><i className="fas fa-map-marker-alt"></i><span>123 Sports Lane, Ahmedabad, Gujarat, India</span></div>
                    <div className="info__item"><i className="fas fa-envelope"></i><span>contact@gamio.com</span></div>
                    <div className="info__item"><i className="fas fa-phone"></i><span>+91 12345 67890</span></div>
                    <div className="map__container" style={{margintop:'2rem'}}>
                         <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117503.70428945415!2d72.4886674391604!3d23.02024345579973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1694709459051!5m2!1sen!2sin" width="100%" height="300" style={{border:'0'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
        </section>
    </main>
    );
}
export default Contact;