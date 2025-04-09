
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import '../../styles/GlobalExercises.css';
import '../../pages/pose-pages/pose-squat';

import mainimage from '../../assets/exercise-media/squat/mini-squat-gif.gif';
import step1 from '../../assets/exercise-media/bicep-curl/step1.svg'
import step2 from '../../assets/exercise-media/bicep-curl/step2.svg'
import step3 from '../../assets/exercise-media/bicep-curl/step3.svg'

const Squat = () => {
  return (
    <div>
      <Navbar />  {/* Add Navbar at the top */}

      <div className="exercises-container">
        {/* Vertical container for exercise header */}
        <div className="exercises-header">
          <h1 className="exercises-title">Squat<br /></h1>
          <h2 className="wahtis-title">What is Squat ?</h2>
          <p className="exercises-description">
            The Bicep Curl is an essential strength training exercise you can do with dumbbells, a barbell, resistance bands, or a cable machine to build strength in the upper arms. Specifically, a bicep curl works the muscles in the front of the arm.
          </p>
          <div className="ctb">
            <Link to="/pose-pages/pose-squat" className="ctb-btn">
              Try With PoseFit
            </Link>
          </div>
        </div>

        {/* Video container */}
        <div className="exercises-video">
          <img src={mainimage} alt="Bicep Curl" className="exercises-image" />
        </div>
      </div>

      {/* Steps section */}
      <div className="steps-container">
        <h2 className="steps-title">How do you do Bicep Curl?</h2>
        <div className="steps">
          {/* Step 01 */}
          <div className="step">
            <div className="step-text">
              <h3 className="step-title">Step 01</h3>
              <p className="step-description">
                Start standing with a dumbbell in each hand. Your elbows should rest at your sides and your forearms should extend out in front of your body. Your knees should stay slightly bent and your belly button should draw into the spine.
              </p>
            </div>
            <img src={step1} alt="Step 1" className="step-image" />
          </div>

          {/* Step 02 */}
          <div className="step">
            <div className="step-text">
              <h3 className="step-title">Step 02</h3>
              <p className="step-description">
                Bring the dumbbells all the way up to your shoulders by bending your elbows. Once at the top, hold for a second by squeezing the muscle.
              </p>
            </div>
            <img src={step2} alt="Step 2" className="step-image" />
          </div>

          {/* Step 03 */}
          <div className="step">
            <div className="step-text">
              <h3 className="step-title">Step 03</h3>
              <p className="step-description">
                Reverse the curl slowly and repeat.
              </p>
            </div>
            <img src={step3} alt="Step 3" className="step-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Squat;
