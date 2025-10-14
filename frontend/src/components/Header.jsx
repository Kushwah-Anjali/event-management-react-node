import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";
import Logo from "./Logo";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/contact", label: "Contact" },
  { path: "/login", label: "Login", icon: "bi bi-person-circle" },
];

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const headerRef = useRef();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => (location.pathname === path ? "activeLink" : "");

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`headerContainer ${scrolled ? "headerScrolled" : ""}`}
      expanded={isExpanded}
      ref={headerRef}
      aria-label="Main navigation"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="headerLogo d-flex align-items-center gap-2">
          <Logo width={40} height={40} />
          Eventify
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-nav"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
          className="headerToggleBtn"
        >
          <span className="headerToggleIcon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav className="headerNav gap-4 px-3 align-items-center">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.path}
                as={Link}
                to={link.path}
                className={`headerLink ${isActive(link.path)}`}
                onClick={() => setIsExpanded(false)}
              >
                {link.icon && <i className={`${link.icon} headerLinkIcon`}></i>}
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
