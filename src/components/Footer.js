import React from "react";
import { Link } from "react-router-dom";

function Footer()
{
    return(
         <footer className="footer">
        <div className="container footer-grid">
            <div className="footer-col">
                <h2><a href="\" >Gamio<span className="nav__logo">.</span></a></h2>
                <p>Your ultimate partner in sports. Find, book, and play with ease.</p>
                 <div className="social-links">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
            <div className="footer-col">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="\">Home</a></li>
                    <li><a href="\Sport">Sports</a></li>
                    <li><a href="\Dashboard">DashBoard</a></li>
                    <li><a href="\Contact">Contact</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h3>Support</h3>
                <ul>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h3>Contact Info</h3>
                <p><i className="fas fa-map-marker-alt"></i> 123 Sports Lane, Playville</p>
                <p><i className="fas fa-phone"></i> +1 234 567 890</p>
                <p><i className="fas fa-envelope"></i> contact@gamio.com</p>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2025 Gamio. All rights reserved.</p>
        </div>
    </footer>
    )
}
export default Footer;