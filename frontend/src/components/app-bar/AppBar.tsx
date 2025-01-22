import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMap,
  faCar,
  faSearch,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import './AppBar.css';

interface AppBarProps {
  mapRef?: React.RefObject<L.Map>;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  handleSearch?: (e: React.FormEvent) => void;
  searchQuery?: string;
  showSearchBar?: boolean;
}

const AppBar: React.FC<AppBarProps> = ({
  mapRef,
  setSearchQuery,
  handleSearch,
  searchQuery,
  showSearchBar = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="app-bar">
      {/* Container for search bar and icons */}
      <div className="app-bar-content">
        {/* Logo on the left */}
        <div className="app-bar-logo">
          <button
            className="logo-icon"
            onClick={() => navigate('/map')}
            title="Back to the Main Map"
          >
            <FontAwesomeIcon icon={faGlobe} />
          </button>

          <span className="logo-text" style={{ whiteSpace: 'nowrap' }}>
            RoadTrip Planner
          </span>
        </div>

        {/* Render search bar conditionally */}
        {showSearchBar && (
          <form onSubmit={handleSearch} className="app-bar-search">
            <div className="search-input-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery && setSearchQuery(e.target.value)
                }
                placeholder="Search for a city"
                className="search-input"
              />
            </div>
          </form>
        )}

        {/* Icons aligned to the right */}
        <div className="app-bar-icons">
          <button
            className="app-bar-button"
            onClick={() => navigate('/visited_places')}
            title="Visited Places"
          >
            <FontAwesomeIcon icon={faMap} />
          </button>
          <button
            className="app-bar-button"
            onClick={() => navigate('/road_trips')}
            title="Road Trip Plans"
          >
            <FontAwesomeIcon icon={faCar} />
          </button>
          <button
            className="app-bar-button"
            onClick={() => navigate('/get_me')}
            title="User Profile"
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
