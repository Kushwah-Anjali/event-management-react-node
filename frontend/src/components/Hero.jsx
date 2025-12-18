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
      <div className="hero-overlay"></div>

      <div className="container py-5 position-relative">
        <p
          className="hero-caption"
          data-aos="fade-in"
          data-aos-delay="200"
        >
          Celebrate • Connect • Create
        </p>

        <h1
          className="hero-title mb-3"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          Your Event, Your Way
        </h1>

        <p
          className="hero-subcaption"
          data-aos="fade-in"
          data-aos-delay="800"
        >
          Discover, Experience, and Make Memories
        </p>

        <a
          href="#event-section"
          className="btn hero-btn"
          data-aos="fade-in"
          data-aos-delay="1200"
        >
          Explore Events
        </a>
      </div>
    </section>
  );
};

export default Hero;
