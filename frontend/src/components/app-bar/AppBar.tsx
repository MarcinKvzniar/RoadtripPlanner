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

/**
 * AppBar component renders the top navigation bar of the application.
 * It includes a logo, a search bar, and navigation buttons.
 *
 * @param {Object} props - The properties object.
 * @param {React.RefObject<HTMLDivElement>} props.mapRef - Reference to the map element.
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setSearchQuery - Function to update the search query state.
 * @param {React.FormEventHandler<HTMLFormElement>} props.handleSearch - Function to handle the search form submission.
 * @param {string} props.searchQuery - The current search query string.
 * @param {boolean} [props.showSearchBar=true] - Flag to show or hide the search bar.
 *
 * @returns {JSX.Element} The rendered AppBar component.
 */
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
      <div className="app-bar-content">
        {/* Logo */}
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

        {/* Search bar */}
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

        {/* Navigation buttons */}
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
