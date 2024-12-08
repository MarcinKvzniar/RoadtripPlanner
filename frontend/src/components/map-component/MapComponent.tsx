import React, { useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './MapComponent.css';

const getFlagIcon = (country: string) => {
  try {
    return L.icon({
      iconUrl: `/utils/flags/${country}.png`,
      iconSize: [16, 16],
      iconAnchor: [8, 16],
      popupAnchor: [0, -16],
    });
  } catch {
    return L.icon({
      iconUrl: '/utils/flags/default.png',
      iconSize: [16, 16],
      iconAnchor: [8, 16],
      popupAnchor: [0, -16],
    });
  }
};

const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<
    { lat: number; lng: number; country: string; type: string }[]
  >([]);
  const [modalData, setModalData] = useState<{
    lat: number;
    lng: number;
    address: string;
    isOpen: boolean;
  }>({ lat: 0, lng: 0, address: '', isOpen: false });
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<L.Map>(null);

  // Handle click on the map to show the modal
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: {
            lat,
            lon: lng,
            format: 'json',
            'accept-language': 'en',
          },
        }
      );

      const address = response.data.display_name || 'Address not found';
      setModalData({ lat, lng, address, isOpen: true });
    } catch (error) {
      console.error('Failed to fetch address:', error);
      setModalData({
        lat,
        lng,
        address: 'Unable to retrieve address',
        isOpen: true,
      });
    }
  };

  // Add a marker based on the modal action
  const handleAddMarker = async (type: string) => {
    const { lat, lng } = modalData;

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: { lat, lon: lng, format: 'json', 'accept-language': 'en' },
        }
      );
      let country = response.data.address.country || 'Unknown';
      country = country.toLowerCase().replace(/\s+/g, '-');
      setMarkers([...markers, { lat, lng, country, type }]);
    } catch (error) {
      console.error('Failed to fetch country name:', error);
      setMarkers([...markers, { lat, lng, country: 'Unknown', type }]);
    }

    setModalData({ ...modalData, isOpen: false });
  };

  // Handle search for city
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: { q: searchQuery, format: 'json', 'accept-language': 'en' },
        }
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        if (mapRef.current) {
          mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 13);
        }
      } else {
        alert('City not found!');
      }
    } catch (error) {
      console.error('Failed to search for city:', error);
      alert('Failed to search for city!');
    }
  };

  return (
    <div className="map-page">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city"
            className="search-input"
          />
        </div>
      </form>

      {/* Map Container */}
      <div className="map-container">
        <MapContainer
          center={[51.11, 17.04]}
          zoom={10}
          className="percentage-map"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents handleMapClick={handleMapClick} />
          {markers.map((marker, idx) => (
            <Marker
              key={`marker-${idx}`}
              position={[marker.lat, marker.lng]}
              icon={getFlagIcon(marker.country)}
            >
              <Popup>
                <span>
                  {marker.country} ({marker.type})
                </span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Modal */}
      {modalData.isOpen && (
        <div className="modal">
          <h2>Add Marker</h2>
          <p>
            <strong>Coordinates:</strong> {modalData.lat.toFixed(4)},{' '}
            {modalData.lng.toFixed(4)}
          </p>
          <p>
            <strong>Address:</strong> {modalData.address}
          </p>
          <div className="modal-buttons">
            <button onClick={() => handleAddMarker('Visited')}>Visited</button>
            <button onClick={() => handleAddMarker('Route')}>
              Add to Route
            </button>
            <button
              onClick={() => setModalData({ ...modalData, isOpen: false })}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Map Events component
const MapEvents = ({
  handleMapClick,
}: {
  handleMapClick: (e: L.LeafletMouseEvent) => void;
}) => {
  useMapEvents({
    click: handleMapClick,
  });
  return null;
};

export default MapComponent;
