import React, { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import '../../styles/pose-global-vid.css';

const PoseCameraView = () => {
  const videoRef = useRef(null);  // This will be the main video element
  const canvasRef = useRef(null);  // Canvas to draw the pose landmarks
  const [errorMessage, setErrorMessage] = useState('');
  const [stream, setStream] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(0.99); // Scale factor to resize the video

  useEffect(() => {
    const requestCameraAccess = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Available Cameras:', videoDevices);

        if (videoDevices.length > 0) {
          setCameraAvailable(true);
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
    if (!isCameraStarted || !cameraAvailable) return;

    const getStream = async () => {
      try {
        const constraints = {
          video: {
            facingMode: 'environment', // Use the rear camera
            width: { ideal: 1280 },  // Set ideal width
            height: { ideal: 720 },  // Set ideal height
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
  }, [isCameraStarted, cameraAvailable]);

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

      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      // Set the canvas size to match the scaled video size
      const scaledWidth = videoWidth * scaleFactor;
      const scaledHeight = videoHeight * scaleFactor;

      // Set the canvas width and height
      canvasElement.width = scaledWidth;
      canvasElement.height = scaledHeight;

      canvasCtx.clearRect(0, 0, scaledWidth, scaledHeight); // Clear the canvas before drawing
      drawPose(results.poseLandmarks, canvasCtx, scaledWidth, scaledHeight);
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
  }, [stream, scaleFactor]);

  const calculateAngle = (p1, p2, p3) => {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs(radians * (180 / Math.PI)); // Convert from radians to degrees
    if (angle > 180) angle = 360 - angle; // Ensure the angle is between 0-180 degrees
    return angle;
  };

  const drawPose = (landmarks, ctx, width, height) => {
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;

    const connections = [
      [11, 13], [13, 15], [12, 14], [14, 16], 
      [11, 12], [11, 23], [12, 24], [23, 24], 
      [23, 25], [24, 26], [25, 27], [26, 28]
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

    // Left Elbow Angle
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];
    
    if (leftShoulder && leftElbow && leftWrist) {
      const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      ctx.font = '20px Arial';
      ctx.fillStyle = 'blue';
      ctx.fillText(`Left Elbow: ${leftElbowAngle.toFixed(2)}°`, leftElbow.x * width + 10, leftElbow.y * height - 10);
    }

    // Right Elbow Angle
    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightWrist = landmarks[16];

    if (rightShoulder && rightElbow && rightWrist) {
      const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
      ctx.fillText(`Right Elbow: ${rightElbowAngle.toFixed(2)}°`, rightElbow.x * width + 10, rightElbow.y * height - 10);
    }

    // Left Shoulder Angle
    if (leftShoulder && leftElbow && leftWrist) {
      const leftShoulderAngle = calculateAngle(leftWrist, leftElbow, leftShoulder);
      ctx.fillText(`Left Shoulder: ${leftShoulderAngle.toFixed(2)}°`, leftShoulder.x * width + 10, leftShoulder.y * height - 10);
    }

    // Right Shoulder Angle
    if (rightShoulder && rightElbow && rightWrist) {
      const rightShoulderAngle = calculateAngle(rightWrist, rightElbow, rightShoulder);
      ctx.fillText(`Right Shoulder: ${rightShoulderAngle.toFixed(2)}°`, rightShoulder.x * width + 10, rightShoulder.y * height - 10);
    }

    // Left Knee Angle
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    if (leftHip && leftKnee && leftAnkle) {
      const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      ctx.fillText(`Left Knee: ${leftKneeAngle.toFixed(2)}°`, leftKnee.x * width + 10, leftKnee.y * height - 10);
    }

    // Right Knee Angle
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    if (rightHip && rightKnee && rightAnkle) {
      const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      ctx.fillText(`Right Knee: ${rightKneeAngle.toFixed(2)}°`, rightKnee.x * width + 10, rightKnee.y * height - 10);
    }

    // Left Hip Angle
    const leftPelvis = landmarks[23];
    if (leftPelvis && leftHip && leftKnee) {
      const leftHipAngle = calculateAngle(leftPelvis, leftHip, leftKnee);
      ctx.fillText(`Left Hip: ${leftHipAngle.toFixed(2)}°`, leftHip.x * width + 10, leftHip.y * height - 10);
    }

    // Right Hip Angle
    const rightPelvis = landmarks[24];
    if (rightPelvis && rightHip && rightKnee) {
      const rightHipAngle = calculateAngle(rightPelvis, rightHip, rightKnee);
      ctx.fillText(`Right Hip: ${rightHipAngle.toFixed(2)}°`, rightHip.x * width + 10, rightHip.y * height - 10);
    }

    // **Draw the oval for the head based on points 8 and 7**
    const point8 = landmarks[8]; // Left side of the face (point 8)
    const point7 = landmarks[7]; // Right side of the face (point 7)

    if (point8 && point7) {
      // Calculate the width of the oval (distance from point 8 to point 7)
      const ovalWidth = Math.sqrt(Math.pow(point8.x - point7.x, 2) + Math.pow(point8.y - point7.y, 2)) * width;
      const ovalHeight = ovalWidth * 1.2; // Set height to 1.2 times the width for an oval shape

      // Draw the oval (ellipse) for the head
      const centerX = (point8.x + point7.x) / 2 * width;
      const centerY = (point8.y + point7.y) / 2 * height;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, ovalWidth / 2, ovalHeight / 2, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = 'green'; // Set circle color
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };

  const startCamera = () => {
    setIsCameraStarted(true);
  };

  return (
    <div className="vid-pose-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
      {errorMessage ? (
        <div className="vid-error-message">{errorMessage}</div>
      ) : (
        <>
          <div className="vid-pose-header">
            <button className="vid-go-back-button" onClick={() => window.history.back()}>GO BACK</button>
            <button className="vid-start-camera-button" onClick={startCamera}>Start Camera</button>
          </div>

          <div className="vid-pose-layout" style={{ position: 'relative' }}>
            {/* Scaled video element for the camera feed */}
            <video ref={videoRef} autoPlay playsInline className="vid-pose-video-preview" style={{ width: `${scaleFactor * 80}%`, height: `${scaleFactor * 80}%` }}></video>
            {/* Canvas element overlaying the video */}
            <canvas ref={canvasRef} className="vid-pose-overlay-canvas" style={{ zIndex: 1000, position: 'absolute', top: 120, right: 420 ,scale:1.1 }}></canvas>
          </div>
        </>
      )}
    </div>
  );
};

export default PoseCameraView;
