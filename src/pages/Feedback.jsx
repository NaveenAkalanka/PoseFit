import React, { useState } from 'react';
import emailjs from 'emailjs-com'; // Import EmailJS
import Navbar from "../components/Navbar"; // Import the Navbar component
import '../styles/Feedback.css';  // Import the CSS file

const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');  // For success/error messages

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name,
      email,
      feedback,
    };

    // Send feedback using EmailJS
    emailjs
      .send('service_9nbkyee', 'template_y70o3sn', templateParams, 'qmdTekwCxtZH5RPr0') // Use Public User ID
      .then(
        (response) => {
          setStatus('Feedback sent successfully!');
          setName('');   // Clear name field
          setEmail('');  // Clear email field
          setFeedback(''); // Clear feedback field
        },
        (error) => {
          setStatus('Failed to send feedback');
          console.log('Error sending feedback:', error);
        }
      );
  };

  return (
    <div>
      <Navbar />  {/* Navbar goes here */}
      
      {/* Hero Section */}
      <div className="fbk-hero">
        <div className="fbk-hero-content">
          <h1 className="fbk-h1">Give Us Your Feedback</h1>
          <p>Your opinion matters! Let us know how we can improve.</p>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="fbk-feedback-form">
        <h2>Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="feedback">Feedback</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit">Submit Feedback</button>
        </form>

        {status && <p className={`fbk-message ${status.includes('successfully') ? 'fbk-success' : 'fbk-error'}`}>{status}</p>}
      </div>
    </div>
  );
};

export default Feedback;
