import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import '../styles/AboutPoseFit.css';  // Import the CSS for styling

const AboutPoseFit = () => {

  // Scroll Animation for each card
  useEffect(() => {
    const cards = document.querySelectorAll('.abp-card');
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
    <div className="abp-about-posefit">
      <Navbar />
      <div className="abp-hero">
        <div className="abp-hero-content">
          <h1 className="abp-h1">About PoseFit</h1>
        </div>
      </div>

      {/* Card for Introduction */}
      <section className="abp-card">
        <h2 className="abp-h2">What is PoseFit?</h2>
        <p className="abp-p">
          PoseFit is an innovative real-time vision-based application designed to improve posture and form during home workouts. By leveraging machine learning and computer vision technologies, PoseFit tracks users' body movements and provides instant feedback to correct posture, enhancing safety and workout effectiveness.
        </p>
      </section>

      {/* Card for Features */}
      <section className="abp-card">
        <h2 className="abp-h2">Features of PoseFit</h2>
        <ul className="abp-ul">
          <li className="abp-li">Real-time pose detection and feedback</li>
          <li className="abp-li">Comprehensive exercise library with step-by-step guides</li>
          <li className="abp-li">Machine learning-powered posture correction</li>
          <li className="abp-li">Supports laptop, webcam, and external camera setups</li>
        </ul>
      </section>

      {/* Card for Benefits */}
      <section className="abp-card">
        <h2 className="abp-h2">Benefits of PoseFit</h2>
        <p className="abp-p">
          PoseFit aims to significantly reduce the risk of injury during home exercises by providing live feedback on posture. The app’s personalized guidance ensures users perform exercises safely, reducing muscle strain and joint injuries. PoseFit also helps optimize exercise form to achieve better results over time.
        </p>
      </section>

      {/* Card for Getting Started */}
      <section className="abp-card">
        <h2 className="abp-h2">How to Get Started</h2>
        <p className="abp-p">
          Getting started with PoseFit is simple! Just follow these steps:
        </p>
        <ul className="abp-ul">
          <li className="abp-li">Set up your webcam or connect an external camera.</li>
          <li className="abp-li">Visit the exercise page and choose your preferred exercise.</li>
          <li className="abp-li">Follow the step-by-step guide, and start exercising with real-time posture correction!</li>
        </ul>
      </section>

      {/* Card for Developer Details */}
      <section className="abp-card">
        <h2 className="abp-h2">Project & Developer Details</h2>
        <p className="abp-p">
          <strong>B. Naveen Akalanka Bulathsinghala</strong> (ID: 2439575)<br />
          <strong>PoseFit:</strong> Real-Time Vision-Based ML Application for Home Exercise Posture Correction<br /><br />
          <strong>Module Leader:</strong> Alix Bergeret<br />
          <strong>Supervisor:</strong> Mr. Nimesh Pollwaththage<br />
          <strong>Reader:</strong> Mr. Dhishan Dhammearatchi<br />
          <strong>BSc (Hons) Computer Networks (Top-up)</strong> - University of Wolverhampton
        </p>
      </section>

      {/* Card for Technologies Used */}
      <section className="abp-card">
        <h2 className="abp-h2">Technologies Used</h2>
        <ul className="abp-ul">
          <li className="abp-li">React.js (Frontend Framework)</li>
          <li className="abp-li">MediaPipe Pose (Real-Time Pose Estimation)</li>
          <li className="abp-li">Node.js (Backend)</li>
          <li className="abp-li">HTML, CSS, and JavaScript (Frontend Technologies)</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="abp-footer">
        <p className="abp-p">Ready to improve your workout performance? Start using PoseFit today!</p>
      </footer>
    </div>
  );
};

export default AboutPoseFit;
