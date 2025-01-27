import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './LoginForm.css';

/**
 * LoginForm component allows users to log in to the RoadTrip Planner application.
 * It provides input fields for email and password, and handles form submission.
 *
 * @component
 * @example
 * return (
 *   <LoginForm />
 * )
 *
 * @returns {JSX.Element} The rendered login form component.
 *
 * @remarks
 * This component uses the `useAuth` hook to access the login function and the `useNavigate` hook
 * from `react-router-dom` to navigate to the map page upon successful login.
 *
 * @function
 * @name LoginForm
 */
const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });
      const { access_token, refresh_token } = response.data;
      login(access_token, refresh_token);
      navigate('/map');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="login-container">
      <h1 className="title">RoadTrip Planner</h1>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input-container">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="icon" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="register-link-container">
        <p>
          Don't have an account? <Link to="/users/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
