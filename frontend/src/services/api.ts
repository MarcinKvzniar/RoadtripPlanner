import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Fetch street rules for a specific country.
 * @returns {Promise<Object>} The street rules data.
 */
export const fetchStreetRules = async (country: string) => {
  try {
    const response = await api.get(`/regulations/road_regulations/${country}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching street rules:', error);
    throw error;
  }
};

/**
 * Get route trips for the current user.
 * @returns {Promise<Object[]>} The user's route trips.
 */
export const getRouteTrips = async () => {
  try {
    const response = await api.get('/route_plans/get_my_route_plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching user routes:', error);
    throw error;
  }
};

/**
 * Save a visited place.
 * @param {Object} marker - The marker object containing place details.
 * @returns {Promise<Object>} The saved place data.
 */
export const saveVisitedPlace = async (marker: {
  id: string;
  lat: number;
  lon: number;
  address: string;
  country: string;
  type: string;
  visited: boolean;
}) => {
  try {
    const response = await api.post('/route_plans/save_destination', marker);
    return response.data;
  } catch (error) {
    console.error('Error saving visited place:', error);
    throw error;
  }
};

/**
 * Get visited places for the current user.
 * @returns {Promise<Object[]>} The user's visited places.
 */
export const getVisitedPlaces = async () => {
  try {
    const response = await api.get('/route_plans/get_destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching visited places:', error);
    throw error;
  }
};

/**
 * Save a route plan.
 * @returns {Promise<Object>} The saved route plan data.
 */
export const saveRoute = async (routePlan: {
  name: string;
  route: {
    _id: string;
    lat: number;
    lon: number;
    address: string;
    country: string;
    type: string;
  }[];
  date_created: string;
  creator_id: string;
}) => {
  try {
    const response = await api.post(
      '/route_plans/create_route_plan',
      routePlan
    );
    return response.data;
  } catch (error) {
    console.error('Error saving route trip:', error);
    throw error;
  }
};

/**
 * Get the current user information.
 * @returns {Promise<Object>} The current user data.
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/my_user');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};
