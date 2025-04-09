import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ExerciseCard.css"; // Ensure CSS file is linked

const ExerciseCard = ({ image, name, description, difficulty, link }) => {
  const navigate = useNavigate();

  // Function to render the correct difficulty bar segments
  const renderDifficultyBars = () => {
    switch (difficulty) {
      case "Easy":
        return (
          <>
            <div className="difficulty-segment green"></div>
            <div className="difficulty-segment green"></div>
            <div className="difficulty-segment green"></div>
            <div className="difficulty-segment green"></div>
          </>
        );
      case "Medium":
        return (
          <>
            <div className="difficulty-segment yellow"></div>
            <div className="difficulty-segment yellow"></div>
            <div className="difficulty-segment yellow"></div>
            <div className="difficulty-segment green"></div>
          </>
        );
      case "Hard":
        return (
          <>
            <div className="difficulty-segment red"></div>
            <div className="difficulty-segment red"></div>
            <div className="difficulty-segment red"></div>
            <div className="difficulty-segment yellow"></div>
          </>
        );
      default:
        return <div className="difficulty-segment gray"></div>;
    }
  };

  return (
    <div className="exercise-card">
      <img src={image} alt={name} className="exercise-image" />
      <h3>{name}</h3>
      <p>{description}</p>

      {/* Difficulty bar */}
      <div className="difficulty">
        <span>Difficulty Level:</span>
        <div className="difficulty-bar">{renderDifficultyBars()}</div>
      </div>

      {/* Correct Posture Button with Navigation */}
      <button className="posture-btn" onClick={() => navigate(link)}>
        Correct Posture
      </button>
    </div>
  );
};

export default ExerciseCard;
