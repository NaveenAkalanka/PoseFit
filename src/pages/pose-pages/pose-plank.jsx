import React, { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import '../../styles/pose-global.css';

// Importing the audio files
import GoodPostureAudio from '../../assets/Audio/Good Posture.wav';
import CloseToGoodPostureAudio from '../../assets/Audio/Close to Good Posture.wav';
import BadPostureAudio from '../../assets/Audio/Bad Posture.wav';

const PoseCameraView = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [stream, setStream] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  // Track completed reps
  const [reps, setReps] = useState(0);

  // Elbow, Knee, Hip, Shoulder angle thresholds for plank pose
  const elbowMaxAngle = 70;   // Maximum angle for elbow (correct plank)
  const elbowMinAngle = 10;   // Minimum angle for elbow
  const kneeMaxAngle = 160;   // Maximum angle for knee (correct plank)
  const kneeMinAngle = 140;   // Minimum angle for knee
  const hipMaxAngle = 165;    // Maximum angle for hip (correct plank)
  const hipMinAngle = 150;    // Minimum angle for hip
  const shoulderMaxAngle = 70; // Maximum angle for shoulder (correct plank)

  // Creating Audio objects for posture states
  const audioRefGreen = useRef(new Audio(GoodPostureAudio)); // Good Posture
  const audioRefYellow = useRef(new Audio(CloseToGoodPostureAudio)); // Close to Good Posture
  const audioRefRed = useRef(new Audio(BadPostureAudio)); // Bad Posture

  const [lastColor, setLastColor] = useState('');
  const [isMuted, setIsMuted] = useState(false); // Mute state

  useEffect(() => {
    const requestCameraAccess = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Available Cameras:', videoDevices);

        if (videoDevices.length > 0) {
          setCameras(videoDevices);
          setCameraAvailable(true);
          setSelectedCamera(videoDevices[0]); // Set the first camera by default
        } else {
          setErrorMessage('No cameras found.');
        }
      } catch (error) {
        console.error('Camera permission denied:', error);
        setErrorMessage('Camera access denied. Please allow access in browser settings.');
      }
    };

    requestCameraAccess();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isCameraStarted || !cameraAvailable || !selectedCamera) return;

    const getStream = async () => {
      try {
        const constraints = {
          video: {
            deviceId: { exact: selectedCamera.deviceId }, // Use selected camera
            facingMode: 'environment', 
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
          },
        };

        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Stream started successfully');
        
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }

        setStream(newStream);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setErrorMessage('Failed to access camera. Check permissions or browser compatibility.');
      }
    };

    getStream();
  }, [isCameraStarted, cameraAvailable, selectedCamera]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    const pose = new Pose({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(results => {
      if (!results.poseLandmarks) return;

      canvasElement.width = canvasElement.clientWidth;
      canvasElement.height = canvasElement.clientHeight;

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      drawPose(results.poseLandmarks, canvasCtx, canvasElement.width, canvasElement.height);
    });

    if (stream) {
      const settings = stream.getVideoTracks()[0].getSettings();
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await pose.send({ image: videoElement });
        },
        width: settings.width,
        height: settings.height,
      });
      camera.start();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const calculateAngle = (p1, p2, p3) => {
    const angleRad = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angleDeg = (angleRad * 180) / Math.PI;
    if (angleDeg < 0) angleDeg += 360;  // Adjust to make it always positive
    return angleDeg;
  };

  const checkBodyColor = (leftElbowAngle, rightElbowAngle, leftKneeAngle, rightKneeAngle, leftHipAngle, rightHipAngle, shoulderAngle) => {
    let color = 'red';  // Default to red for incorrect position

    if (leftElbowAngle <= elbowMaxAngle && leftElbowAngle >= elbowMinAngle &&
        rightElbowAngle <= elbowMaxAngle && rightElbowAngle >= elbowMinAngle &&
        leftKneeAngle <= kneeMaxAngle && leftKneeAngle >= kneeMinAngle &&
        rightKneeAngle <= kneeMaxAngle && rightKneeAngle >= kneeMinAngle &&
        leftHipAngle <= hipMaxAngle && leftHipAngle >= hipMinAngle &&
        rightHipAngle <= hipMaxAngle && rightHipAngle >= hipMinAngle &&
        shoulderAngle <= shoulderMaxAngle) {
      color = 'green'; // Correct plank position
    } else if (color !== 'green') {
      color = 'yellow'; // Close to good posture
    }
    return color;
  };

  const drawPose = (landmarks, ctx, width, height) => {
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];
    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightWrist = landmarks[16];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftWrist);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightWrist);
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    const shoulderAngle = calculateAngle(leftShoulder, rightShoulder, leftHip);  // Shoulder to shoulder

    const bodyColor = checkBodyColor(leftElbowAngle, rightElbowAngle, leftKneeAngle, rightKneeAngle, leftHipAngle, rightHipAngle, shoulderAngle);

    // Only play the sound when the color changes, and the sound isn't muted
    if (bodyColor !== lastColor && !isMuted) {
      if (bodyColor === 'green') {
        audioRefGreen.current.play(); // Play "Good Posture"
      } else if (bodyColor === 'yellow') {
        audioRefYellow.current.play(); // Play "Close to Good Posture"
      } else if (bodyColor === 'red') {
        audioRefRed.current.play(); // Play "Bad Posture"
      }

      setLastColor(bodyColor);  // Update the last color
    }

    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 15;

    const connections = [
      [11, 13], [13, 15], [12, 14], [14, 16], // Shoulder -> Elbow -> Wrist
      [11, 12], [23, 25], [24, 26], // Shoulder to Shoulder, Hip to Knee
      [11, 23], [12, 24], // Shoulder to Hip
      [23, 24]  // Hip to Hip connection
    ];

    connections.forEach(([start, end]) => {
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      if (p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x * width, p1.y * height);
        ctx.lineTo(p2.x * width, p2.y * height);
        ctx.stroke();
      }
    });

    // **Reps Count Display**
    ctx.fillStyle = 'white';
    ctx.fillText(`Reps: ${reps}`, width - 100, height - 30);
  };

  const startCamera = () => {
    setIsCameraStarted(true);
  };

  const handleMuteToggle = () => {
    setIsMuted(prevState => {
      const newMutedState = !prevState;
      if (newMutedState) {
        // Mute all audio
        audioRefGreen.current.muted = true;
        audioRefYellow.current.muted = true;
        audioRefRed.current.muted = true;
      } else {
        // Unmute all audio
        audioRefGreen.current.muted = false;
        audioRefYellow.current.muted = false;
        audioRefRed.current.muted = false;
      }
      return newMutedState;
    });
  };

  return (
    <div className="pose-container">
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : (
        <>
          <div className="pose-header">
            <button className="go-back-button" onClick={() => window.history.back()}>GO BACK</button>
            <button className="start-camera-button" onClick={startCamera}>Start Camera</button>
            <select onChange={(e) => setSelectedCamera(cameras.find(cam => cam.deviceId === e.target.value))} value={selectedCamera?.deviceId}>
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId}`}
                </option>
              ))}
            </select>
            <button onClick={handleMuteToggle}>
              {isMuted ? 'Unmute' : 'Mute'} Posture Sounds
            </button>
          </div>

          <div className="pose-layout">
            <video ref={videoRef} autoPlay playsInline className="pose-video-preview"></video>
            <canvas ref={canvasRef} className="pose-drawing-canvas"></canvas>
          </div>
        </>
      )}
    </div>
  );
};

export default PoseCameraView;
