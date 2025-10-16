import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Welcome.css";
import welcomeImg from "../assets/images/WelcomeImg.jpg";

const Welcome = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
      easing: "ease-out-cubic",
    });

    const glow = document.querySelector(".gradientGlow");
    window.addEventListener("scroll", () => {
      if (glow) glow.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    });
  }, []);

  return (
    <section className="position-relative overflow-hidden welcome text-light py-5">
      <div className="gradientGlow"></div>

      <div className="container d-flex flex-wrap align-items-center justify-content-between py-5">
        {/* Text */}
        <div
          className="flex-fill mb-4 mb-lg-0 zoomOnScroll"
          style={{ maxWidth: "550px" }}
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <h6 className="text-uppercase fw-bold text-pink mb-2" style={{ letterSpacing: "2px" }}>
            WELCOME TO
          </h6>
          <h1 className="fw-bold mb-3" style={{
            background: "linear-gradient(90deg, #ec4899, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: "1.2",
            // fontSize: "clamp(2.5rem, 4vw, 2rem)"
          }}>
            EVENT MANAGEMENT
          </h1>
          <p className="text-light mb-4">
            Manage, plan, and organize your events seamlessly.<br />
            From college fests to workshops and hackathons,<br />
            everything in one place – simple, modern, and efficient.
          </p>
          <a href="/contact" className="btn btn-gradient">
            Contact Us →
          </a>
        </div>

        {/* Image */}
        <div
          className="flex-fill zoomOnScroll"
          style={{ maxWidth: "500px" }}
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <img src={welcomeImg} alt="Welcome" className="img-fluid rounded shadow" />
        </div>
      </div>
    </section>
  );
};

export default Welcome;
