import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/login-form/LoginForm';
import RegisterForm from './components/register-form/RegisterForm';
import NotFoundPage from './components/not-found/NotFoundPage';
import MapComponent from './components/map-component/MapComponent';
import PrivateRoute from './private-route/PrivateRoute';
import './App.css';
import VisitedMap from './components/visited-map/VisitedMap';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/users/login" element={<LoginForm />} />
          <Route path="/users/register" element={<RegisterForm />} />

          {/* Private routes */}
          <Route
            path="/map"
            element={<PrivateRoute element={<MapComponent />} />}
          />
          <Route
            path="/get_me"
            element={<PrivateRoute element={<h1>Nothing is here</h1>} />}
          />
          <Route
            path="/visited_places"
            element={<PrivateRoute element={<VisitedMap />} />}
          />
          <Route
            path="/road_trips"
            element={<PrivateRoute element={<h1>Nothing is here</h1>} />}
          />

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
