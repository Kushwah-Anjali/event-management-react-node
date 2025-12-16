import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/Footer.css";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import {
  faHome,
  faCalendarAlt,
  faEnvelope,
  faCommentDots,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer
      style={{
              background: "linear-gradient(135deg, #0a0a2a)",
      }}
      className="pt-5 pb-3"
    >
      <Container>
        <Row className="gy-4 justify-content-between">
          {/* Brand Section */}
          <Col xs={12} md={4} className="text-center text-md-start">
            <h3 className="fw-light mb-3 border-bottom border-2 border-primary d-inline-block pb-1 text-white">
              Eventify
            </h3>
            <p className="small text-secondary">
              Simplifying event management with innovation and seamless coordination.
            </p>
           <div className="d-flex gap-3 mt-3 justify-content-center justify-content-md-start">
  {[
    { icon: faFacebookF, color: "#1877F2" }, // Facebook Blue
    { icon: faInstagram, color: "#E4405F" }, // Instagram Pink
    { icon: faLinkedinIn, color: "#0A66C2" }, // LinkedIn Blue
    { icon: faWhatsapp, color: "#25D366" }, // WhatsApp Green
  ].map((item, idx) => (
    <a
      key={idx}
      href="#"
      target="_blank"
      rel="noreferrer"
      className="fs-5 social-icon"
      style={{
        color: item.color,
        transition: "all 0.3s ease",
      }}
    >
      <FontAwesomeIcon icon={item.icon} />
    </a>
  ))}
</div>

          </Col>

          {/* Quick Links */}
          <Col xs={12} md={4} className="text-center text-md-start">
            <h4 className="fw-light mb-3 border-bottom border-2 border-primary d-inline-block pb-1 text-white">
              Quick Links
            </h4>
            <ul className="list-unstyled">
              {[
                { icon: faHome, label: "Home", href: "#home" },
                { icon: faCalendarAlt, label: "Events", href: "#events" },
                { icon: faEnvelope, label: "Contact", href: "#contact" },
                { icon: faCommentDots, label: "Feedback", href: "#feedback" },
              ].map((link, idx) => (
                <li
                  key={idx}
                  className="mb-2 d-flex align-items-center gap-2 justify-content-center justify-content-md-start"
                >
                  <FontAwesomeIcon icon={link.icon} className="text-secondary" />
                  <a href={link.href} className="text-secondary text-decoration-none">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Contact */}
          <Col xs={12} md={4} className="text-center text-md-start">
            <h4 className="fw-light mb-3 border-bottom border-2 border-primary d-inline-block pb-1 text-white">
              Contact
            </h4>
            <ul className="list-unstyled">
              {[
                { icon: faEnvelope, text: "info@eventify.com" },
                { icon: faPhone, text: "+91 12345 67890" },
                { icon: faMapMarkerAlt, text: "Mumbai, India" },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="mb-2 d-flex align-items-center gap-2 justify-content-center justify-content-md-start"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-secondary" />
                  <span className="text-secondary">{item.text}</span>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        <div className="text-center mt-4 pt-3 border-top border-secondary small text-secondary">
          &copy; {new Date().getFullYear()} Eventify. Crafted with <span className="text-danger">❤</span> by <strong>Anju</strong>.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
