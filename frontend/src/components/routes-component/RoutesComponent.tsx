import React, { useEffect, useState } from 'react';
import './RoutesComponent.css';
import { getRouteTrips } from '../../services/api';
import AppBar from '../app-bar/AppBar';

interface Stop {
  lat: number;
  lon: number;
  address: string;
  country: string;
  type: string;
}

interface RoutePlan {
  name: string;
  route: Stop[];
  date_created: string;
  creator_id: string;
}

/**
 * RoutePlansComponent is a React functional component that fetches and displays
 * a list of saved route plans. It handles loading, error, and empty states.
 *
 * @component
 * @example
 * return (
 *   <RoutePlansComponent />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * This component uses the `useState` and `useEffect` hooks to manage state and
 * side effects. It fetches route plans from an API and displays them in a scrollable
 * list. If there are no route plans, it shows a message indicating that there are
 * no saved route plans.
 *
 * @hook
 * @name useState
 * @description Manages the state of route plans, loading status, and error messages.
 *
 * @hook
 * @name useEffect
 * @description Fetches route plans from the API when the component mounts.
 *
 * @function fetchRoutePlans
 * @description An asynchronous function that fetches route plans from the API and
 * updates the state accordingly.
 *
 * @param {RoutePlan[]} routePlans - The list of route plans fetched from the API.
 * @param {boolean} loading - The loading state of the component.
 * @param {string | null} error - The error message if fetching route plans fails.
 *
 * @returns {JSX.Element} The rendered component.
 */

const RoutePlansComponent: React.FC = () => {
  const [routePlans, setRoutePlans] = useState<RoutePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutePlans = async () => {
      try {
        const data = await getRouteTrips();
        console.log('Fetched route plans:', data);
        setRoutePlans(data);
      } catch (err) {
        console.error('Error fetching route plans:', err);
        setError('Failed to load route plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutePlans();
  }, []);

  return (
    <div className="route-plans-page">
      <AppBar showSearchBar={false} />
      <div className="route-plans-container">
        <h2>Your Saved Route Plans</h2>
        {loading ? (
          <div className="loading-message">Loading route plans...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : routePlans.length > 0 ? (
          <div className="route-plans-scrollable">
            {routePlans.map((plan, index) => (
              <div key={index} className="route-plan-card">
                <h3>{plan.name}</h3>
                <p>
                  <strong>Created On:</strong>{' '}
                  {new Date(plan.date_created).toLocaleDateString()}
                </p>
                <p>
                  <strong>Stops:</strong>
                  <ol>
                    {plan.route.map((stop, stopIndex) => (
                      <li key={stopIndex}>{stop.address}</li>
                    ))}
                  </ol>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-route-plans">You have no saved route plans.</p>
        )}
      </div>
    </div>
  );
};

export default RoutePlansComponent;
