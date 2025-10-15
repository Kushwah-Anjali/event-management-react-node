import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faEnvelope,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Header.css";
import Logo from "./Logo";

const navLinks = [
  { path: "/", label: "Home", icon: faHouse },
  { path: "/contact", label: "Contact", icon: faEnvelope },
  { path: "/login", label: "Login", icon: faUserCircle },
];

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const headerRef = useRef();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar
      expand="lg"
      variant="dark"
      bg="dark"
      sticky="top"
      expanded={expanded}
      ref={headerRef}
      className={`shadow-sm py-2 ${scrolled ? "navbar-scrolled" : ""}`}
    >
      <Container fluid>
        {/* Brand Section */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center fw-bold fs-4 text-light"
        >
          <Logo width={40} height={40} />
          Eventify
        </Navbar.Brand>

        {/* Toggle for Mobile */}
        <Navbar.Toggle
          aria-controls="main-nav"
          onClick={() => setExpanded(!expanded)}
        />

        {/* Navigation Links */}
        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.path}
                as={Link}
                to={link.path}
                onClick={() => setExpanded(false)}
                className={`text-light fw-semibold px-3 d-flex align-items-center gap-2 ${
                  isActive(link.path) ? "active-link" : ""
                }`}
              >
                <FontAwesomeIcon icon={link.icon} className="fs-5" />
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
