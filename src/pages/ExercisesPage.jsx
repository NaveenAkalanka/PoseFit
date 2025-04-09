import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ExerciseCard from "../components/ExerciseCard";
import "../styles/ExercisesPage.css";

// ✅ Import .webp Images
import squatImg from "../assets/Exercises/Squat.webp";
import pushUpImg from "../assets/Exercises/Push-Up.webp";
import plankImg from "../assets/Exercises/Plank.webp";
import bicepCurlImg from "../assets/Exercises/Bicep Curl.webp";
import deadliftImg from "../assets/Exercises/Deadlift.webp";
import highKneeImg from "../assets/Exercises/High Knee.webp";
import jumpSquatImg from "../assets/Exercises/Jump Squat.webp";
import legRaiseImg from "../assets/Exercises/Leg Raise.webp";
import lungesImg from "../assets/Exercises/Lunges.webp";
import mountainClimberImg from "../assets/Exercises/Mountain Climber.webp";
import partialCurlImg from "../assets/Exercises/Partial Curl.webp";
import shoulderPressImg from "../assets/Exercises/Shoulder Press.webp";

const exercises = [
    // 🟢 Easy Difficulty
    { name: "Bicep Curl", image: bicepCurlImg, description: "Targets biceps to improve upper body strength.", difficulty: "Easy", link: "/exercise/bicep-curl" },
    { name: "Squat", image: squatImg, description: "Strengthens legs, glutes, and core with a full-body motion.", difficulty: "Easy", link: "/exercise/squat" },
    { name: "Push-Up", image: pushUpImg, description: "Builds upper body and core strength using body weight.", difficulty: "Easy", link: "/exercise/push-up" },
    { name: "Plank", image: plankImg, description: "Boosts core stability and endurance with a static hold.", difficulty: "Easy", link: "/exercise/plank" },
  
    // 🟡 Medium Difficulty
    { name: "Jump Squat", image: jumpSquatImg, description: "Adds explosive power and cardio to standard squats.", difficulty: "Medium", link: "/exercise/jump-squat" },
    { name: "Mountain Climber", image: mountainClimberImg, description: "Improves core stability and cardio endurance.", difficulty: "Medium", link: "/exercise/mountain-climber" },
    { name: "High Knee", image: highKneeImg, description: "Engages core and boosts cardiovascular fitness.", difficulty: "Medium", link: "/exercise/high-knee" },
    { name: "Partial Curl", image: partialCurlImg, description: "Strengthens the upper abs with controlled movements.", difficulty: "Medium", link: "/exercise/partial-curl" },
  
    // 🔴 Hard Difficulty
    { name: "Deadlift", image: deadliftImg, description: "Engages posterior chain muscles for strength and power.", difficulty: "Hard", link: "/exercise/deadlift" },
    { name: "Lunges", image: lungesImg, description: "Enhances leg strength and balance with controlled movement.", difficulty: "Hard", link: "/exercise/lunges" },
    { name: "Leg Raise", image: legRaiseImg, description: "Strengthens the lower abs and hip flexors.", difficulty: "Hard", link: "/exercise/leg-raise" },
    { name: "Shoulder Press", image: shoulderPressImg, description: "Builds upper body strength, focusing on shoulders.", difficulty: "Hard", link: "/exercise/shoulder-press" }
];

const ExercisesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="hero-section">
        <h1>Select an Exercise to Start Real-Time Posture Correction</h1>
        <div className="search-container">
          <i className="fa fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search for an exercise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
      </div>
  
      {/* NEW WRAPPER TO PREVENT SCROLLBAR */}
      <div className="exercise-container">
        <div className="exercise-grid">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise, index) => (
              <ExerciseCard key={index} {...exercise} link={exercise.link} />
            ))
          ) : (
            <p>No exercises found.</p>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default ExercisesPage;
