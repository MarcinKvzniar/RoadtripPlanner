import React, { useState } from 'react';
import { api } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './RegisterForm.css';
import { Link, useNavigate } from 'react-router-dom';

/**
 * RegisterForm component allows users to register by providing their full name, email, password, and confirming the password.
 * It validates the input fields and displays appropriate error messages if the validation fails.
 * On successful registration, it navigates the user to the login page with a success message.
 *
 * @component
 * @example
 * return (
 *   <RegisterForm />
 * )
 *
 * @returns {JSX.Element} The rendered RegisterForm component.
 */

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !confirmPassword || !fullName) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await api.post('/users/register', {
        email,
        password,
        full_name: fullName,
      });

      navigate('/users/login', {
        state: {
          message: `Registration successful! Welcome, ${response.data.full_name}`,
        },
      });
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Error during registration.');
    }
  };

  return (
    <div className="register-container">
      <h1 className="title">RoadTrip Planner</h1>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <div className="input-container">
          <FontAwesomeIcon icon={faUser} className="icon" />
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
          />
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="icon" />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="icon" />
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="login-link-container">
        <p>
          Already have an account? <Link to="/users/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
