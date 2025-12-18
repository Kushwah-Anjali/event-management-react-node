import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaEnvelope, FaUserCircle } from "react-icons/fa";
import Logo from "./Logo";
import "../styles/Header.css";

const navLinks = [
  { path: "/", label: "Home", icon: FaHome },
  { path: "/contact", label: "Contact", icon: FaEnvelope },
  { path: "/login", label: "Login", icon: FaUserCircle },
];

const NavItems = ({ isActive, onClick, animated = false }) => (
  <>
    {navLinks.map((link, index) => {
      const Icon = link.icon;
      return (
        <Nav.Link
          as={Link}
          key={link.path}
          to={link.path}
          onClick={onClick}
          className={`fw-semibold d-flex align-items-center gap-2 nav-link ${
            isActive(link.path) ? "active-link" : ""
          } ${animated ? "mobile-nav-item" : ""}`}
          style={animated ? { animationDelay: `${index * 0.08}s` } : undefined}
        >
          <span className="nav-icon">
            <Icon />
          </span>
          {link.label}
        </Nav.Link>
      );
    })}
  </>
);

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // “Have I scrolled more than 50 pixels?”
      const isScrolled = window.scrollY > 50;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar
        expand="lg"
        variant="dark"
        sticky="top"
        className={`shadow-sm py-2 ${scrolled ? "navbar-scrolled" : "bg-dark"}`}
      >
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center fw-bold fs-4 text-light"
          >
            <Logo width={40} height={40} />
            <span className="ms-2">Eventify</span>
          </Navbar.Brand>

          <Navbar.Toggle onClick={() => setShowCanvas(true)} />

          {/* Desktop Nav */}
          <Navbar.Collapse className="justify-content-end d-none d-lg-flex">
            <Nav>
              <NavItems isActive={isActive} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas */}
      <Offcanvas
        show={showCanvas}
        onHide={() => setShowCanvas(false)}
        placement="end"
        className="bg-dark text-light"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="d-flex align-items-center gap-2">
            <Logo width={40} height={40} />
            Eventify
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav className="flex-column">
            <NavItems
              isActive={isActive}
              onClick={() => setShowCanvas(false)}
              animated
            />
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
