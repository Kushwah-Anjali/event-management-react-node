import React from "react";
import styles from "../styles/Hero.module.css";
import heroBg from "../assets/images/HeroImg.jpg";

const Hero = () => {
  return (
    <section
      className={styles.heroSection}
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className={styles.container}>
        <p className={styles.heroCaption}>Celebrate • Connect • Create</p>
        <h1 className={styles.heroTitle}>Your Event, Your Way</h1>
        <p className={styles.heroSubcaption}>
          Discover, Experience, and Make Memories
        </p>
        <a href="#event-section" className={styles.heroBtn}>
          Explore Events
        </a>
      </div>
    </section>
  );
};

export default Hero;
