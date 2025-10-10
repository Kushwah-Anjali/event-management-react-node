import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";
import  Logo from "./Logo";
const navLinks = [
  { path: "/", label: "Home" },
  { path: "/contact", label: "Contact" },
  { path: "/login", label: "Login", icon: "bi bi-person-circle" },
];

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navbarRef = useRef();

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      expanded={isExpanded}
      ref={navbarRef}
       aria-label="Main navigation"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="navbar__brand d-flex align-items-center gap-2">
         <Logo width={40} height={40} />
      Eventify
               
        </Navbar.Brand>
 <Navbar.Toggle
      aria-controls="main-nav"
      aria-expanded={isExpanded}
      onClick={() => setIsExpanded(!isExpanded)}
      className="navbar__toggler"
    >
      <span className="navbar__toggler-icon"></span>
    </Navbar.Toggle>

        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav className="gap-4 px-3 align-items-center">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.path}
                as={Link}
                to={link.path}
                className={`navbar__link ${isActive(link.path)}`}
                onClick={() => setIsExpanded(false)} // auto-close on link click
              >
                {link.icon && <i className={`${link.icon} navbar__icon`}></i>}
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
