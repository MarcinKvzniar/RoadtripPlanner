import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/login-form/LoginForm';
import RegisterForm from './components/register-form/RegisterForm';
import NotFoundPage from './components/not-found/NotFoundPage';
import MapComponent from './components/map-component/MapComponent';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* Private routes */}
          <Route path="/map" element={<MapComponent />} />
          <Route path="/get_me" element={<h1>Nothing is here</h1>} />{' '}
          {/* TODO */}
          <Route
            path="/visited-places"
            element={<h1>Nothing is here</h1>}
          />{' '}
          {/* TODO */}
          <Route path="/road-trips" element={<h1>Nothing is here</h1>} />{' '}
          {/* TODO */}
          {/* Not found route */}
          <Route path="*" element={<NotFoundPage />} />
          {/* Login redirect */}
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
