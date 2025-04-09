import React, { useState } from 'react';
import emailjs from 'emailjs-com';  // Import EmailJS
import Navbar from "../components/Navbar"; // Import the Navbar component
import '../styles/RegisterPage.css';  // Import the CSS file

const RegisterForm = () => {
  // Set initial form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus('');

    const templateParams = {
      name,
      email,
    };

    try {
      // Send registration data using EmailJS
      const response = await emailjs.send(
        'service_9nbkyee',
        'template_tkpkfyo',
        templateParams,
        'qmdTekwCxtZH5RPr0'  // Use your EmailJS public key here
      );

      if (response.status === 200) {
        setStatus('Registration successful!');
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('Error submitting form. Please try again later.');
      console.log('Error sending registration data:', error);
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <Navbar />  {/* Navbar goes here */}

      {/* Hero Section */}
      <div className="regn-hero">
        <div className="regn-hero-content">
          <h1 className="regn-h1">Join Us and Get Started!</h1>
          <p className="regn-p">Sign up to create your account and get started with PoseFit.</p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="regn-div">
        <div className="regn-feedback-form">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
          </form>

          {status && <p>{status}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
