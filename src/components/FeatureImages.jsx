import React from "react";
import "../styles/FeatureImages.css";
import LeftImage from "../assets/home assets/Home-R.png"; 
import RightImage from "../assets/home assets/Home-L.png"; 

const FeatureImages = () => {
  return (
    <section className="feature-section">
      <img src={LeftImage} alt="PoseFit AI Analysis" className="feature-image left-image" />
      <img src={RightImage} alt="PoseFit Workout AI" className="feature-image right-image" />
    </section>
  );
};

export default FeatureImages;
