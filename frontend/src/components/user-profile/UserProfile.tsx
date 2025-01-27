import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { getCurrentUser } from '../../services/api';
import AppBar from '../app-bar/AppBar';

interface UserProfileData {
  email: string;
  full_name: string;
  destinations: string[];
}

const UserProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getCurrentUser();
        console.log(response);
        setUserProfile(response);
      } catch (error) {
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="user-profile-page">
      <AppBar showSearchBar={false} />
      <div className="user-profile">
        <h2>User Profile</h2>
        {userProfile && (
          <div>
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
            <p>
              <strong>Full Name:</strong> {userProfile.full_name}
            </p>
            <p>
              <strong>Number of visited places:</strong>{' '}
              {userProfile.destinations.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
