import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/login-form/LoginForm';
import RegisterForm from './components/register-form/RegisterForm';
import NotFoundPage from './components/not-found/NotFoundPage';
import MapComponent from './components/map-component/MapComponent';
import PrivateRoute from './private-route/PrivateRoute';
import VisitedMap from './components/visited-map/VisitedMap';
import RoutesComponent from './components/routes-component/RoutesComponent';
import './App.css';
import UserProfile from './components/user-profile/UserProfile';

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
            element={<PrivateRoute element={<UserProfile />} />}
          />
          <Route
            path="/visited_places"
            element={<PrivateRoute element={<VisitedMap />} />}
          />
          <Route
            path="/road_trips"
            element={<PrivateRoute element={<RoutesComponent />} />}
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
