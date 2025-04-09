import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; // Import the new HomePage component
import RegisterPage from "./pages/RegisterPage";
import ExercisesPage from "./pages/ExercisesPage";
import HowToUse from "./pages/HowToUse";
import AboutPoseFit from "./pages/AboutPoseFit";
import Feedback from "./pages/Feedback.jsx";

import "./App.css";

// ✅ Import individual exercise detail pages
import BicepCurl from "./pages/Exercise Detail Pages/BicepCurl";
import Deadlift from "./pages/Exercise Detail Pages/Deadlift";
import HighKnee from "./pages/Exercise Detail Pages/HighKnee";
import JumpSquat from "./pages/Exercise Detail Pages/JumpSquat";
import LegRaise from "./pages/Exercise Detail Pages/LegRaise";
import Lunges from "./pages/Exercise Detail Pages/Lunges";
import MountainClimber from "./pages/Exercise Detail Pages/MountainClimber";
import PartialCurl from "./pages/Exercise Detail Pages/PartialCurl";
import Plank from "./pages/Exercise Detail Pages/Plank";
import PushUp from "./pages/Exercise Detail Pages/PushUp";
import ShoulderPress from "./pages/Exercise Detail Pages/ShoulderPress";
import Squat from "./pages/Exercise Detail Pages/Squat";

//
import PoseBicepCurl from "./pages/pose-pages/pose-bicep-curl";
import PoseSquat from "./pages/pose-pages/pose-squat"
import PosePlank from "./pages/pose-pages/pose-plank"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register_page" element={<RegisterPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/howtouse" element={<HowToUse />} />
        <Route path="/about" element={<AboutPoseFit />} />
        <Route path="/feedback" element={<Feedback />} />
        


        {/* Routes for individual exercise detail pages */}
        <Route path="/exercise/bicep-curl" element={<BicepCurl />} />
        <Route path="/exercise/deadlift" element={<Deadlift />} />
        <Route path="/exercise/high-knee" element={<HighKnee />} />
        <Route path="/exercise/jump-squat" element={<JumpSquat />} />
        <Route path="/exercise/leg-raise" element={<LegRaise />} />
        <Route path="/exercise/lunges" element={<Lunges />} />
        <Route path="/exercise/mountain-climber" element={<MountainClimber />} />
        <Route path="/exercise/partial-curl" element={<PartialCurl />} />
        <Route path="/exercise/plank" element={<Plank />} />
        <Route path="/exercise/push-up" element={<PushUp />} />
        <Route path="/exercise/shoulder-press" element={<ShoulderPress />} />
        <Route path="/exercise/squat" element={<Squat />} />

        <Route path="/pose-pages/pose-bicep-curl" element={<PoseBicepCurl />} />
        <Route path="/pose-pages/pose-squat" element={<PoseSquat />} />
        <Route path="/pose-pages/pose-plank" element={<PosePlank />} />

      </Routes>
    </Router>
  );
};

export default App;
