import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faEnvelope, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import "../styles/Header.css";

const navLinks = [
  { path: "/", label: "Home", icon: faHouse },
  { path: "/contact", label: "Contact", icon: faEnvelope },
  { path: "/login", label: "Login", icon: faUserCircle },
];

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar expand="lg" variant="dark" sticky="top" className={`shadow-sm py-2 ${scrolled ? "navbar-scrolled" : "bg-dark"}`}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold fs-4 text-light">
            <Logo width={40} height={40} />
            <span className="ms-2">Eventify</span>
          </Navbar.Brand>

          <Navbar.Toggle onClick={() => setShowCanvas(true)} />

          <Navbar.Collapse className="justify-content-end d-none d-lg-flex">
            <Nav>
              {navLinks.map((link) => (
                <Nav.Link
                  as={Link}
                  key={link.path}
                  to={link.path}
                  className={`fw-semibold px-3 d-flex align-items-center gap-2 ${isActive(link.path) ? "active-link" : "text-light"}`}
                >
                  <FontAwesomeIcon icon={link.icon} />
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Offcanvas for mobile */}
      <Offcanvas show={showCanvas} onHide={() => setShowCanvas(false)} placement="end" className="bg-dark text-light">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="d-flex align-items-center gap-2">
            <Logo width={40} height={40} /> Eventify
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navLinks.map((link, index) => (
              <Nav.Link
                as={Link}
                key={link.path}
                to={link.path}
                onClick={() => setShowCanvas(false)}
                className={`fw-semibold d-flex align-items-center gap-2 my-2 ${isActive(link.path) ? "active-link" : "text-light"} mobile-nav-item`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <FontAwesomeIcon icon={link.icon} />
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
