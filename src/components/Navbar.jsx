import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PoseFitLogo from "../assets/home assets/PoseFit.png";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  let lastScrollY = window.scrollY;

  useEffect(() => {
    const handleScroll = () => {
      setScrollingUp(window.scrollY < lastScrollY);
      lastScrollY = window.scrollY;
    };

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`navbar-container ${scrollingUp ? "show" : "hide"}`}>
      <div className="navbar-background"></div>
      <nav className="navbar">
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Logo */}
        <img
          src={PoseFitLogo}
          alt="PoseFit Logo"
          className="logo"
          onClick={() => navigate("/")}
        />

        {/* Desktop Navigation Links */}
        <ul className={`nav-links ${screenWidth < 1300 ? "hide" : ""}`}>
          <li><a href="/exercises">Exercises</a></li>
          <li><a href="/howtouse">How To Use</a></li>
          <li><a href="/about">About PoseFit</a></li>
          <li><a href="/feedback">Feedback</a></li>
        </ul>

        {/* Register Button */}
        {screenWidth >= 1300 && location.pathname !== "/register_page" && (
          <button className="register-btn" onClick={() => navigate("/register_page")}>
            Register Now
          </button>
        )}
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><a href="/exercises">Exercises</a></li>
          <li><a href="/howtouse">How To Use</a></li>
          <li><a href="/about">About PoseFit</a></li>
          <li><a href="/feedback">Feedback</a></li>
          {location.pathname !== "/register_page" && (
            <li><a href="/register_page">Register Now</a></li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
