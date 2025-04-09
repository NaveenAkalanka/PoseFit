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

  // Elbow angle thresholds (in 360° range)
  const elbowMaxAngle = 178;  // Maximum angle for fully extended elbow
  const elbowMinAngle = 10;   // Minimum angle for fully bent elbow

  // Angle thresholds for yellow and red colors
  const yellowThreshold = 20; // The threshold for yellow (close range)
  const redThreshold = 20; // The threshold for red (far range)

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

  const checkBodyColor = (leftElbowAngle, rightElbowAngle) => {
    let color = 'red';  // Default to red for incorrect position
    if (leftElbowAngle >= elbowMinAngle && leftElbowAngle <= elbowMaxAngle &&
        rightElbowAngle >= elbowMinAngle && rightElbowAngle <= elbowMaxAngle) {
      color = 'green'; // Both elbows within the green range
    } else if ((leftElbowAngle > elbowMaxAngle && leftElbowAngle <= elbowMaxAngle + yellowThreshold) ||
               (rightElbowAngle > elbowMaxAngle && rightElbowAngle <= elbowMaxAngle + yellowThreshold)) {
      color = 'yellow'; // Either elbow close to the range
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

    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

    const bodyColor = checkBodyColor(leftElbowAngle, rightElbowAngle);

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

    // Draw the oval for the head based on points 8 and 7, color changes based on posture
    const point8 = landmarks[8]; // Left side of the face (point 8)
    const point7 = landmarks[7]; // Right side of the face (point 7)

    if (point8 && point7) {
      const ovalWidth = Math.sqrt(Math.pow(point8.x - point7.x, 2) + Math.pow(point8.y - point7.y, 2)) * width;
      const ovalHeight = ovalWidth * 1.2;

      const centerX = (point8.x + point7.x) / 2 * width;
      const centerY = (point8.y + point7.y) / 2 * height;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, ovalWidth / 2, ovalHeight / 2, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = bodyColor; // Oval color based on posture
      ctx.lineWidth = 15;
      ctx.stroke();
    }

    // **Display angles for joints (shoulder, elbow, knee, etc.)**
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black'; // Always black for angle text
    ctx.fillText(`Left Elbow: ${leftElbowAngle.toFixed(2)}°`, leftElbow.x * width + 10, leftElbow.y * height - 10);
    ctx.fillText(`Right Elbow: ${rightElbowAngle.toFixed(2)}°`, rightElbow.x * width + 10, rightElbow.y * height - 10);

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
