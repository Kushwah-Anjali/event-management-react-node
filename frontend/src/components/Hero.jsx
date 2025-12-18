import React, { useEffect } from "react";
import "../styles/Hero.css";

const Hero = () => {
  useEffect(() => {
    const hero = document.querySelector(".hero-section");
    const handleScroll = () => {
      const scaleValue = 1 + window.scrollY * 0.0005;
      hero.style.setProperty("--scroll-scale", scaleValue);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="hero-section d-flex flex-column justify-content-center align-items-center text-center position-relative overflow-hidden"
      style={{ minHeight: "calc(100vh - 65px)" }}
    >
      {/* Overlay for readability */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="container py-5 position-relative">
        <p className="hero-caption">Celebrate • Connect • Create</p>
        <h1 className="hero-title mb-3">Your Event, Your Way</h1>
        <p className="hero-subcaption">
          Discover, Experience, and Make Memories
        </p>
        <a href="#event-section" className="btn hero-btn">
          Explore Events
        </a>
      </div>
    </section>
  );
};

export default Hero;
