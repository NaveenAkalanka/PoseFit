import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import '../../styles/GlobalExercises.css';
import '../../pages/pose-pages/pose-plank';

import mainimage from '../../assets/exercise-media/plank/plank.gif';
import step1 from '../../assets/exercise-media/plank/step1.jpg'
import step2 from '../../assets/exercise-media/plank/step2.jpg'
import step3 from '../../assets/exercise-media/plank/step3.jpg'

const Plank = () => {
  return (
    <div>
      <Navbar />  {/* Add Navbar at the top */}

      <div className="exercises-container">
        {/* Vertical container for exercise header */}
        <div className="exercises-header">
          <h1 className="exercises-title">Plank</h1>
          <h2 className="wahtis-title">What is Plank?</h2>
          <p className="exercises-description">
            The Plank is an isometric core strength exercise that involves holding a position similar to a push-up for a period of time. It targets your abdominal muscles, back, and shoulders, and is excellent for building endurance.
          </p>
          <div className="ctb">
            <Link to="/pose-pages/pose-plank" className="ctb-btn">
              Try With PoseFit
            </Link>
          </div>
        </div>

        {/* Video container */}
        <div className="exercises-video">
          <img src={mainimage} alt="Plank" className="exercises-image" />
        </div>
      </div>

      {/* Steps section */}
      <div className="steps-container">
        <h2 className="steps-title">How do you do Plank?</h2>
        <div className="steps">
          {/* Step 01 */}
          <div className="step">
            <div className="step-text">
              <h3 className="step-title">Step 01</h3>
              <p className="step-description">
                Start by lying face down on the floor. Place your elbows under your shoulders and your forearms on the ground. Lift your body up so that your body forms a straight line from your head to your heels.
              </p>
            </div>
            <img src={step1} alt="Step 1" className="step-image" />
          </div>

          {/* Step 02 */}
          <div className="step">
            <div className="step-text">
              <h3 className="step-title">Step 02</h3>
              <p className="step-description">
                Engage your core by pulling your belly button towards your spine. Keep your body as straight as possible, avoiding letting your hips sag or your back arch.
              </p>
            </div>
            <img src={step2} alt="Step 2" className="step-image" />
          </div>

          {/* Step 03 */}
          <div className="step">
            <div className="step-text">
              <h3 className="step-title">Step 03</h3>
              <p className="step-description">
                Hold the position for as long as you can while maintaining proper form. Start with shorter holds and gradually increase the duration as you build strength.
              </p>
            </div>
            <img src={step3} alt="Step 3" className="step-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plank;
