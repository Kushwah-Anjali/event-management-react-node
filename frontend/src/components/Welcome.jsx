import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "../styles/Welcome.module.css";
import welcomeImg from "../assets/images/WelcomeImg.jpg";

const Welcome = () => {
  useEffect(() => {
    AOS.init({
  duration: 2000,       // increase from 1200ms → 2s
  once: true,
  easing: "ease-out-cubic",
});
    // Optional: parallax for gradient glow
    const glow = document.querySelector(`.${styles.gradientGlow}`);
    window.addEventListener("scroll", () => {
      if (glow) {
        glow.style.transform = `translateY(${window.scrollY * 0.2}px)`;
      }
    });
  }, []);

  return (
    <section className={styles.welcomeSection}>
      {/* Gradient glow */}
      <div className={styles.gradientGlow}></div>

      {/* Text */}
      <div
        className={`${styles.welcomeText} ${styles.zoomOnScroll}`}
        data-aos="fade-right"
        data-aos-delay="100"
      >
        <h6>WELCOME TO</h6>
        <h1>EVENT MANAGEMENT</h1>
        <p>
          Manage, plan, and organize your events seamlessly.  
          From college fests to workshops and hackathons,  
          everything in one place – simple, modern, and efficient.
        </p>
        <a href="/contact" className={styles.btnStarted}>
          Contact Us →
        </a>
      </div>

      {/* Image */}
      <div
        className={`${styles.welcomeImage} ${styles.zoomOnScroll}`}
        data-aos="fade-left"
        data-aos-delay="200"
      >
        <img src={welcomeImg} alt="Welcome" />
      </div>
    </section>
  );
};

export default Welcome;
