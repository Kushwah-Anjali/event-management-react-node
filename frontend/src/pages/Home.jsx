import React from "react";
import Hero from "../components/Hero";
import Welcome from "../components/Welcome";
import Events from "../components/Events";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Welcome Section */}
      <Welcome />
        <Events />
        <Feedback/>
        <Footer/>
    </>
  );
};

export default Home;
