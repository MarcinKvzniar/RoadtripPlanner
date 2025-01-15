import React, { useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './MapComponent.css';
import AppBar from '../app-bar/AppBar';
import polyline from '@mapbox/polyline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoute,
  faTrashAlt,
  faInfoCircle,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';

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
    {
      id: string;
      lat: number;
      lon: number;
      address: string;
      country: string;
      type: string;
      visited: boolean;
    }[]
  >([]);
  const [modalData, setModalData] = useState<{
    lat: number;
    lon: number;
    address: string;
    country: string;
    isOpen: boolean;
  }>({ lat: 0, lon: 0, address: '', country: 'unknown', isOpen: false });
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<L.Map>(null);
  const [routeMarkers, setRouteMarkers] = useState<
    {
      id: string;
      lat: number;
      lon: number;
      address: string;
      country: string;
      type: string;
      visited: boolean;
    }[]
  >([]);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [travelTimes, setTravelTimes] = useState<string[]>([]);
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);

  // Handle click on the map to show the modal
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: {
            lat,
            lon,
            format: 'json',
            'accept-language': 'en',
          },
        }
      );

      const address = response.data.address;
      const country = address.country
        ? address.country.toLowerCase().replace(/\s+/g, '-')
        : 'unknown';

      const street =
        `${address.road} ${address.house_number || ''}`.trim() ||
        'Unknown Street';
      const city =
        address.city || address.town || address.village || 'Unknown City';

      setModalData({
        lat,
        lon,
        address: `${street}, ${city}, ${address.country}`,
        country,
        isOpen: true,
      });
    } catch (error) {
      console.error('Failed to fetch address:', error);
      setModalData({
        lat,
        lon,
        address: 'Unable to retrieve address',
        country: 'unknown',
        isOpen: true,
      });
    }
  };

  // Add a marker based on the modal action
  const handleAddMarker = async (type: string) => {
    const { lat, lon, address } = modalData;

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: { lat, lon, format: 'json', 'accept-language': 'en' },
        }
      );
      let country = response.data.address.country || 'Unknown';
      country = country.toLowerCase().replace(/\s+/g, '-');
      if (['south-ossetia', 'abkhazia'].includes(country)) country = 'georgia'; // wtf is this api, free georgia
      if (country === 'northern-cyprus') country = 'cyprus'; // lol not a country
      if (country === 'unknown') country = 'default';

      const visited = type === 'Visited';
      const visitedId = (
        markers.filter((marker) => marker.type === 'Visited').length + 1
      ).toString();
      const routeId = (
        markers.filter((marker) => marker.type === 'Route').length + 1
      ).toString();
      const id = type === 'Visited' ? visitedId : routeId;
      const visitedMarker = { id, lat, lon, address, country, type, visited };

      setMarkers([...markers, visitedMarker]);

      if (type === 'Route') {
        setRouteMarkers([
          ...routeMarkers,
          {
            id: routeId,
            lat,
            lon,
            address,
            country,
            type,
            visited: false,
          },
        ]);
      } else if (type === 'Visited') {
        await saveVisitedMarker(visitedMarker);
      }

      console.log(`${type} marker:`, visitedMarker);
    } catch (error) {
      console.error('Failed to fetch country name:', error);
      setMarkers([
        ...markers,
        {
          id: (markers.length + 1).toString(),
          lat,
          lon,
          address: 'Unknown',
          country: 'default',
          type,
          visited: false,
        },
      ]);
    }

    setModalData({ ...modalData, isOpen: false });
  };

  // Fetch route between markers
  const fetchRoute = async () => {
    if (routeMarkers.length < 2) {
      alert('Please add at least two markers to calculate a route.');
      return;
    }

    const coordinates = routeMarkers
      .map((marker) => `${marker.lon},${marker.lat}`)
      .join(';');

    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${coordinates}`,
        { params: { overview: 'full', geometries: 'polyline' } }
      );

      const routeData = response.data.routes[0];
      if (routeData) {
        const decodedRoute = polyline.decode(routeData.geometry);
        setRoute(decodedRoute.map(([lat, lng]) => [lat, lng]));

        const times = routeData.legs.map((leg: { duration: number }) => {
          const minutes = Math.round(leg.duration / 60);
          return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
        });

        const filledTimes = Array(routeMarkers.length - 1)
          .fill(null)
          .map((_, index) => times[index] || 'N/A');
        setTravelTimes(filledTimes);
        console.log(routeMarkers);
      } else {
        console.error('No route found.');
      }
    } catch (error) {
      console.error('Failed to fetch route:', error);
    }
  };

  // Clear the route
  const clearRoute = () => {
    setRoute([]);
    setTravelTimes([]);
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
      markers.filter((marker) => marker.lat !== lat || marker.lon !== lng)
    );

    setRouteMarkers(
      routeMarkers.filter((marker) => marker.lat !== lat || marker.lon !== lng)
    );
  };

  // Handle saving visited places
  const saveVisitedMarker = async (marker: {
    id: string;
    lat: number;
    lon: number;
    address: string;
    country: string;
    visited: boolean;
  }) => {
    try {
      await axios.post('/eoeoeoeo', { ...marker, type: 'Visited' }); // ADJUST THE API URL
      console.log('Visited marker saved:', marker);
    } catch (error) {
      console.error('Error saving visited marker:', error);
    }
  };

  // Handle saving route
  const saveRoute = async (
    markers: {
      id: string;
      lat: number;
      lon: number;
      address: string;
      country: string;
      type: string;
      visited: boolean;
    }[]
  ) => {
    try {
      await axios.post('/eooeoeoeoeoeo', { routeMarkers: markers });
      console.log('Route saved:', markers);
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  // Save road trip on button click
  const saveRoadTrip = async () => {
    if (routeMarkers.length === 0) {
      alert('No route markers to save!');
      return;
    }
    await saveRoute(routeMarkers);
  };

  return (
    <div className="map-page">
      <AppBar
        mapRef={mapRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
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
              position={[marker.lat, marker.lon]}
              icon={getFlagIcon(marker.country)}
            >
              <Popup>
                <div>
                  <p>
                    <strong>Country:</strong> {marker.country.toUpperCase()}
                  </p>
                  <p>
                    <strong>Coordinates:</strong> {marker.lat.toFixed(4)},{' '}
                    {marker.lon.toFixed(4)}
                  </p>
                  <p>
                    <strong>Type:</strong> {marker.type}
                  </p>
                  <button
                    onClick={() => handleDeleteMarker(marker.lat, marker.lon)}
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
          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>
      </div>

      {modalData.isOpen && (
        <div className="modal">
          <h2>Add Marker</h2>
          <p>
            <strong>Coordinates:</strong> {modalData.lat.toFixed(4)},{' '}
            {modalData.lon.toFixed(4)}
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

      {/* Lower buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          backgroundColor: 'black',
        }}
      >
        <button
          onClick={fetchRoute}
          style={{
            flex: 1,
            margin: '10px 5px',
            padding: '10px 15px',
            backgroundColor: 'grey',
            color: 'white',
            border: '1px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon
            icon={faMapMarkedAlt}
            style={{ marginRight: '5px' }}
          />
          Calculate Route
        </button>

        <button
          onClick={clearRoute}
          style={{
            flex: 1,
            margin: '10px 5px',
            padding: '10px 15px',
            backgroundColor: 'grey',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '5px' }} />
          Clear Route
        </button>

        <button
          onClick={() => setIsRouteDialogOpen(true)}
          style={{
            flex: 1,
            margin: '10px 5px',
            padding: '10px 15px',
            backgroundColor: 'grey',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '5px' }} />
          Show Route Details
        </button>
        <button
          onClick={saveRoadTrip}
          style={{
            flex: 1,
            margin: '10px 5px',
            padding: '10px 15px',
            backgroundColor: 'grey',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon icon={faRoute} style={{ marginRight: '5px' }} />
          Save Road Trip
        </button>
      </div>

      {/* Route dialog */}
      {isRouteDialogOpen && (
        <div className="modal">
          <h2>Your Road Trip!</h2>
          <div className="droppable-container">
            {routeMarkers.map(
              (marker, index) =>
                index < routeMarkers.length - 1 && (
                  <div
                    key={index}
                    className="draggable-item"
                    style={{
                      border: '1px solid #ccc',
                      marginBottom: '10px',
                      padding: '10px',
                      backgroundColor: '#fff',
                      borderRadius: '5px',
                    }}
                  >
                    <p
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      Route {index + 1}
                    </p>
                    <p>
                      <b>A: </b>
                      {marker.address}
                    </p>
                    <p>
                      <b>B: </b>
                      {routeMarkers[index + 1]?.address}
                    </p>
                    <p>
                      <b>Time: </b>
                      {travelTimes[index]}
                    </p>
                  </div>
                )
            )}
          </div>
          <button onClick={() => setIsRouteDialogOpen(false)}>Close</button>
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
