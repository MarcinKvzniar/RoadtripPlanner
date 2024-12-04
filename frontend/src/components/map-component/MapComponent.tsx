import React, { useState } from 'react';
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
    { lat: number; lng: number; country: string }[]
  >([]);

  const addMarker = async (e: L.LeafletMouseEvent) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: { lat, lon: lng, format: 'json', 'accept-language': 'en' },
        }
      );
      let country = response.data.address.country || 'Unknown';
      console.log('Country:', country);
      country = country.toLowerCase().replace(/\s+/g, '-');
      setMarkers([...markers, { lat, lng, country }]);
    } catch (error) {
      console.error('Failed to fetch country name:', error);
      setMarkers([...markers, { lat, lng, country: 'Unknown' }]);
    }
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[51.11, 17.04]}
        zoom={10}
        className="percentage-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents addMarker={addMarker} />
        {markers.map((marker, idx) => (
          <Marker
            key={`marker-${idx}`}
            position={[marker.lat, marker.lng]}
            icon={getFlagIcon(marker.country)}
          >
            <Popup>
              <span>{marker.country}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button>Determine Route</button>
      <button>Save Trip</button>
    </div>
  );
};

const MapEvents = ({
  addMarker,
}: {
  addMarker: (e: L.LeafletMouseEvent) => void;
}) => {
  useMapEvents({
    click: addMarker,
  });
  return null;
};

export default MapComponent;
