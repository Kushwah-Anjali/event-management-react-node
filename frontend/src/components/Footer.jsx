import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaHome,
  FaCalendarAlt,
  FaEnvelope,
  FaCommentDots,
  FaPhone,
  FaMapMarkerAlt,
  FaCode,
} from "react-icons/fa";

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
              Simplifying event management with innovation and seamless
              coordination.
            </p>
            <div className="d-flex gap-3 mt-3 justify-content-center justify-content-md-start">
            {[
  { icon: FaFacebookF, color: "#1877F2" },
  { icon: FaInstagram, color: "#E4405F" },
  { icon: FaLinkedinIn, color: "#0A66C2" },
  { icon: FaWhatsapp, color: "#25D366" },
].map((item, idx) => {
  const Icon = item.icon;

  return (
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
      <Icon />
    </a>
  );
})}

            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} md={4} className="text-center text-md-start">
            <h4 className="fw-light mb-3 border-bottom border-2 border-primary d-inline-block pb-1 text-white">
              Quick Links
            </h4>
            <ul className="list-unstyled">
             {[
  { icon: FaHome, label: "Home", href: "#home" },
  { icon: FaCalendarAlt, label: "Events", href: "#events" },
  { icon: FaEnvelope, label: "Contact", href: "#contact" },
  { icon: FaCommentDots, label: "Feedback", href: "#feedback" },
].map((link, idx) => {
  const Icon = link.icon;

  return (
    <li
      key={idx}
      className="mb-2 d-flex align-items-center gap-2 justify-content-center justify-content-md-start"
    >
      <Icon className="text-secondary" />
      <a href={link.href} className="text-secondary text-decoration-none">
        {link.label}
      </a>
    </li>
  );
})}

            </ul>
          </Col>

          {/* Contact */}
          <Col xs={12} md={4} className="text-center text-md-start">
            <h4 className="fw-light mb-3 border-bottom border-2 border-primary d-inline-block pb-1 text-white">
              Contact
            </h4>
            <ul className="list-unstyled">
           {[
  { icon: FaEnvelope, text: "info@eventify.com" },
  { icon: FaPhone, text: "+91 12345 67890" },
  { icon: FaMapMarkerAlt, text: "Mumbai, India" },
].map((item, idx) => {
  const Icon = item.icon;

  return (
    <li
      key={idx}
      className="mb-2 d-flex align-items-center gap-2 justify-content-center justify-content-md-start"
    >
      <Icon className="text-secondary" />
      <span className="text-secondary">{item.text}</span>
    </li>
  );
})}

            </ul>
          </Col>
        </Row>

      <div className="text-center mt-4 pt-3 border-top border-secondary small text-secondary">
  &copy; {new Date().getFullYear()} Eventify. Crafted with{" "}
  <FaCode className="text-secondary mx-1" /> by <strong>Anju</strong>.
</div>

      </Container>
    </footer>
  );
};

export default Footer;
