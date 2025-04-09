import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Perfect Your Form, Perfect Your Workout
          <br />
          <span>Best Home Fitness Companion</span>
        </h1>
        <p>
          Experience the future of home fitness with intelligent, real-time, personalized posture correction.
          <br />
          Empowering every move to ensure safer workouts, flawless form, and maximized results from the comfort of your home.
        </p>
        <button className="cta-btn" onClick={() => navigate("/exercises")}>
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
