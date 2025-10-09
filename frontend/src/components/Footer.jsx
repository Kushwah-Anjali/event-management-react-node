import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Brand Section */}
        <div className="footer-section about">
          <h3>Eventify</h3>
          <p>
            Simplifying event management with innovation, precision, and
            seamless coordination.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><i className="fas fa-home"></i> <a href="#home">Home</a></li>
            <li><i className="fas fa-calendar-alt"></i> <a href="#events">Events</a></li>
            <li><i className="fas fa-envelope"></i> <a href="../">Contact</a></li>
            <li><i className="fas fa-comment-dots"></i> <a href="#feedback">Feedback</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h4>Contact</h4>
          <ul>
            <li><i className="fas fa-envelope"></i> info@eventify.com</li>
            <li><i className="fas fa-phone-alt"></i> +91 12345 67890</li>
            <li><i className="fas fa-map-marker-alt"></i> Mumbai, India</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Eventify. Crafted with{" "}
          <span className="heart">❤</span> by <strong>Anju</strong>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
