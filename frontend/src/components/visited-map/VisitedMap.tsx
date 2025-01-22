import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getVisitedPlaces } from '../../services/api';
import './VisitedMap.css';
import { useNavigate } from 'react-router-dom';

const getFlagIcon = (country: string) => {
  const iconUrl =
    country === 'unknown'
      ? '/utils/flags/default.png'
      : `/utils/flags/${country}.png`;
  return L.icon({
    iconUrl,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -16],
  });
};

interface Place {
  id: string;
  lat: number;
  lon: number;
  address: string;
  country: string;
  type: string;
  visited: boolean;
}

const VisitedMap = () => {
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([]);
  const mapRef = useRef<L.Map>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await getVisitedPlaces();
        setVisitedPlaces(response);
      } catch (error) {
        console.error('Error fetching visited places:', error);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="visited-places-page">
      <div className="visited-places-header">
        <h2>Your Visited Places</h2>
        <button onClick={() => navigate('/map')} className="back-to-map-button">
          <b> Back to Main Map </b>
        </button>
      </div>

      <div className="map-container">
        <MapContainer
          center={[51.11, 17.04]}
          zoom={10}
          minZoom={3}
          className="percentage-map"
          ref={mapRef}
          worldCopyJump={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            noWrap={false}
          />
          {visitedPlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lon]}
              icon={getFlagIcon(place.country)}
            >
              <Popup>
                <div>
                  <p>
                    <strong>Country:</strong> {place.country.toUpperCase()}
                  </p>
                  <p>
                    <strong>Address:</strong> {place.address}
                  </p>
                  <button
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete Place
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default VisitedMap;
