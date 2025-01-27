import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { getCurrentUser } from '../../services/api';
import AppBar from '../app-bar/AppBar';

interface UserProfileData {
  email: string;
  full_name: string;
  destinations: string[];
}

/**
 * UserProfile component fetches and displays the current user's profile information.
 *
 * This component:
 * - Fetches the user profile data when it mounts.
 * - Displays a loading message while the data is being fetched.
 * - Displays an error message if the data fetch fails.
 * - Displays the user's email, full name, and the number of visited places once the data is successfully fetched.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
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
