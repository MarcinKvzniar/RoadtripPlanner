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

export const fetchStreetRules = async (country: string) => {
  try {
    const response = await api.get(`/regulations/road_regulations/${country}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching street rules:', error);
    throw error;
  }
};

export const getRouteTrips = async () => {
  try {
    const response = await api.get('/route_plans/get_my_route_plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching user routes:', error);
    throw error;
  }
};

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

export const getVisitedPlaces = async () => {
  try {
    const response = await api.get('/route_plans/get_destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching visited places:', error);
    throw error;
  }
};
