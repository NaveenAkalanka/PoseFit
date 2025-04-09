import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureImages from "../components/FeatureImages";
import "../styles/HomePage.css"; // Keep your original styles

const HomePage = () => {
  const homeRef = useRef(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "auto";

    const navbar = document.querySelector(".navbar"); 
    if (navbar && homeRef.current) {
      homeRef.current.style.paddingTop = `${navbar.offsetHeight}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      if (homeRef.current) {
        homeRef.current.style.paddingTop = "0px";
      }
    };
  }, []);

  return (
    <div ref={homeRef} className="home-container">
      <Navbar />
      <HeroSection />
      <FeatureImages />
    </div>
  );
};

export default HomePage;
