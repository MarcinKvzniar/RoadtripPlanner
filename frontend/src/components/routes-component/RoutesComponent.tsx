import React, { useEffect, useState } from 'react';
import './RoutesComponent.css';
import { getRouteTrips } from '../../services/api';
import AppBar from '../app-bar/AppBar';

interface RoutePlan {
  id: string;
  name: string;
  description: string;
  stops: string[];
}

const RoutePlansComponent: React.FC = () => {
  const [routePlans, setRoutePlans] = useState<RoutePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutePlans = async () => {
      try {
        const data = await getRouteTrips();
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
            {routePlans.map((plan) => (
              <div key={plan.id} className="route-plan-card">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <p>
                  <strong>Stops:</strong> {plan.stops.join(', ')}
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
