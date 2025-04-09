import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import '../styles/HowToUse.css';  // Import the CSS for styling
import laptopTvImage from '../assets/how-to-use/Basic Setup.png';  // Image for setup
import dressCodeImage from '../assets/how-to-use/Dress Code.png';  // Image for dress code

const HowToUse = () => {

  // Scroll Animation for each card
  useEffect(() => {
    const cards = document.querySelectorAll('.htu-card');
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-card');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    cards.forEach(card => observer.observe(card));
  }, []);

  return (
    <div className="htu-how-to-use">
      <Navbar />
      <div className="hero">
        <div className="hero-content">
          <h1 className="htu-h1">How to Use PoseFit</h1>
        </div>
      </div>

      {/* Card for Basic Setup */}
      <section className="htu-card">
        <h2 className="htu-h2">Basic Setup to Use PoseFit</h2>
        <p className="htu-p">
          To begin using PoseFit, follow the setup steps below:
        </p>
        <ul className="htu-ul">
          <li className="htu-li">First, use your laptop or desktop and place it in front of you for better performance.</li>
          <li className="htu-li">Alternatively, you can connect your laptop or computer display to a TV. Use a separate webcam (or the built-in laptop webcam) and position it in front of the TV for a better experience.</li>
        </ul>
        <img src={laptopTvImage} alt="Basic Setup to Use PoseFit" className="htu-image"/>
      </section>

      {/* Card for Conditions to Use PoseFit */}
      <section className="htu-card">
        <h2 className="htu-h2">Conditions to Use PoseFit</h2>
        <p className="htu-p">
          To ensure the best performance, please keep the following conditions in mind:
        </p>
        <ul className="htu-ul">
          <li className="htu-li">Wear a slim-fit workout outfit that doesn't blend into the background.</li>
          <li className="htu-li">Avoid wearing oversized clothes that may obscure your body movements.</li>
          <li className="htu-li">Ensure good lighting conditions. Poor lighting may hinder PoseFit's performance.</li>
        </ul>
        <img src={dressCodeImage} alt="Dress Code for PoseFit" className="htu-image"/>
      </section>

      {/* Card for Using PoseFit */}
      <section className="htu-card">
        <h2 className="htu-h2">Using PoseFit</h2>
        <p className="htu-p">
          After preparing, you can start using PoseFit:
        </p>
        <ul className="htu-ul">
          <li className="htu-li">Go to the exercise page and select the exercise that you prefer.</li>
          <li className="htu-li">On the exercise page, you'll find a complete guide on how to perform the exercise and how to position yourself for proper pose correction.</li>
        </ul>
      </section>

      {/* Card for Pose Correction Interface */}
      <section className="htu-card">
        <h2 className="htu-h2">Pose Correction Interface</h2>
        <p className="htu-p">
          In the Pose Correction Interface, you have the following options:
        </p>
        <ul className="htu-ul">
          <li className="htu-li">Change camera settings if needed.</li>
          <li className="htu-li">Mute audio if you prefer to work silently.</li>
          <li className="htu-li">Go back to the previous page if you need to make adjustments or change exercises.</li>
        </ul>
      </section>

      {/* Footer with Navigation */}
      <footer className="htu-footer">
        <Link to="/" className="htu-cta-btn">Back to Home</Link>
      </footer>
    </div>
  );
};

export default HowToUse;
