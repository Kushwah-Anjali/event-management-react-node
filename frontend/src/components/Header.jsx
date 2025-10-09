import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => { 
  
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="navbar__brand">
          Eventify
        </Navbar.Brand>

        {/* Toggler */}
        <Navbar.Toggle aria-controls="main-nav" className="navbar__toggler">
          <span className="navbar__toggler-icon"></span>
        </Navbar.Toggle>

        {/* Nav Links */}
        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav className="gap-4 px-3 align-items-center">
            <Nav.Link as={Link} to="/" className={`navbar__link ${isActive("/")}`}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className={`navbar__link ${isActive("/contact")}`}>
              Contact
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className={`navbar__link ${isActive("/login")}`}>
              <i className="bi bi-person-circle navbar__icon"></i> Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
