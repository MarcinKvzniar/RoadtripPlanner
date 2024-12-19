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
import './MapComponent.css';
import AppBar from '../app-bar/AppBar';

const getFlagIcon = (country: string) => {
  const iconUrl =
    country === 'Unknown'
      ? '/utils/flags/default.png'
      : `/utils/flags/${country}.png`;
  return L.icon({
    iconUrl,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -16],
  });
};

const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<
    { lat: number; lng: number; country: string; type: string }[]
  >([]);
  const [modalData, setModalData] = useState<{
    lat: number;
    lng: number;
    address: string;
    country: string;
    isOpen: boolean;
  }>({ lat: 0, lng: 0, address: '', country: 'unknown', isOpen: false });
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

      const address = response.data.address;
      const country = address.country
        ? address.country.toLowerCase().replace(/\s+/g, '-')
        : 'unknown';
      const fullAddress = response.data.display_name || 'Address not found';

      setModalData({ lat, lng, address: fullAddress, country, isOpen: true });
    } catch (error) {
      console.error('Failed to fetch address:', error);
      setModalData({
        lat,
        lng,
        address: 'Unable to retrieve address',
        country: 'unknown',
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
      if (country === 'south-ossetia' || country === 'abkhazia')
        country = 'georgia'; /*/ Free Georgia, wtf is this api */
      if (country === 'northern-cyprus')
        country = 'cyprus'; /*/ there is no such a country lol /*/
      if (country === 'unknown') country = 'default'; /*/ default flag /*/

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

  // Handle deleting marker
  const handleDeleteMarker = (lat: number, lng: number) => {
    setMarkers(
      markers.filter((marker) => marker.lat !== lat || marker.lng !== lng)
    );
  };

  // Handle saving visited places
  const saveMarkedPlaces = () => console.log('Save Marked Places'); /* TODO */

  // Handle saving road trip
  const saveRoadTrip = () => console.log('Save Road Trip'); /* TODO */

  return (
    <div className="map-page">
      <AppBar
        mapRef={mapRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        saveMarkedPlaces={saveMarkedPlaces} /* TODO */
        saveRoadTrip={saveRoadTrip} /* TODO */
      />

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
          <MapEvents handleMapClick={handleMapClick} />
          {markers.map((marker, idx) => (
            <Marker
              key={`marker-${idx}`}
              position={[marker.lat, marker.lng]}
              icon={getFlagIcon(marker.country)}
            >
              <Popup>
                <div>
                  <p>
                    <strong>Country:</strong> {marker.country.toUpperCase()}
                  </p>
                  <p>
                    <strong>Coordinates:</strong> {marker.lat.toFixed(4)},{' '}
                    {marker.lng.toFixed(4)}
                  </p>
                  <p>
                    <strong>Type:</strong> {marker.type}
                  </p>
                  <button
                    onClick={() => handleDeleteMarker(marker.lat, marker.lng)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete Marker
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

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
