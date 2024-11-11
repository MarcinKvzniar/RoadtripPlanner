# RoadTripPlanner Architecture Documentation

## Overview

**RoadTripPlanner** is a full-stack web application that allows users to plan, edit, and save road trips on an interactive map. The app integrates various features such as location-based editing, road rule lookups for different countries, and user authentication to create a personalized and secure road trip planning experience.

---

## 1. Technologies Used

- **Backend**: Django (Python)
- **Frontend**: React (TypeScript)
- **Database**: PostgreSQL for persistence of user data, trip details, and visited locations
- **API Integration**: External APIs for street rules by country (Google Maps API, UNESCO API)
- **Authentication**: Django Authentication with JWT tokens for secure user sessions
- **Deployment**: Docker for containerization, Nginx as a reverse proxy, and Gunicorn for WSGI

---

## 2. System Architecture

### 2.1 Frontend (React)

- **Components**:

  - **Map Component**: An interactive map where users can add, edit, and remove stops.
  - **Trip Management Component**: Allows users to save, load, and manage multiple road trips.
  - **Visited Points Component**: Interface for marking locations visited by the user.
  - **Street Rules Component**: Displays relevant street rules based on the countries selected.
  - **Authentication Component**: User registration, login, and profile management.

- **Data Flow**: React will use Redux or Context API to manage application state, including user sessions and map data. API calls to the backend will be managed by Axios.

### 2.2 Backend (Django)

- **REST API**: Django REST Framework (DRF) will expose RESTful API endpoints for frontend interaction.
- **Modules**:
  - **User Management**: Handles registration, login, and user-specific data (trips and visited locations).
  - **Trip Management**: CRUD operations for creating, updating, saving, and loading trips.
  - **Visited Points Management**: Tracks locations marked as visited.
  - **Street Rules API Module**: Interfaces with external APIs to retrieve country-specific road rules.
- **Authentication & Authorization**: JWT tokens will be issued on login and validated on each request for access control.

### 2.3 Database (PostgreSQL)

- **Schemas**:
  - **User**: Stores user profile and authentication data.
  - **Trip**: Stores trip details, including trip name, starting point, endpoints, and stops.
  - **VisitedPoint**: Tracks locations a user has marked as visited.
  - **StreetRuleCache** (Optional): Caches retrieved street rules to minimize external API calls.

### 2.4 External Services

- **Map Service**: Integrates with mapping APIs (e.g., Google Maps or OpenStreetMap) for location plotting.
- **Street Rules API**: Pulls road rule data from an external source for each country selected by the user.

---

## 3. Data Flow

1. **User Login and Registration**:

   - User submits credentials to Django API.
   - Django authenticates the user and returns a JWT token.
   - The frontend stores the token for subsequent requests.

2. **Trip Management**:

   - User interacts with the map and adds stops.
   - React component sends POST/PUT requests to the Django API to save or update trip data.
   - Django stores the trip information in the PostgreSQL database.

3. **Street Rules Lookup**:

   - When a user’s trip passes through a new country, a GET request is sent to Django.
   - Django calls the external Street Rules API, caches the response, and returns it to React.
   - The frontend displays the rules to the user in the Street Rules Component.

4. **Visited Points**:
   - User marks a location as visited, and a request is sent to the Django API.
   - Django updates the `VisitedPoint` table for the user, and the frontend updates the map display.

---

## 4. Deployment Pipeline

1. **Development**:

   - Code versioned and reviewed using Git.
   - Local development with Docker for consistent environment setup.

2. **Staging**:

   - Deploy to a staging server for testing.
   - Automate with Docker Compose to deploy the Django and React containers.

3. **Production**:
   - Nginx as a reverse proxy to serve static files and route requests.
   - Gunicorn as the application server for Django.
   - Continuous integration (CI) and deployment (CD) set up for efficient updates.

---

## 5. Error Handling and Logging

- **Frontend**: Graceful error messages for failed actions like saving trips or loading map data.
- **Backend**:
  - Logging with Django’s logging framework.
  - Custom error messages for each endpoint to assist in debugging.

---

## 6. API Documentation

API documentation will be created using **Swagger**, detailing each endpoint’s request and response format, authentication requirements, and error codes.

---

## 7. Testing

- **Frontend**: Unit tests with Jest and integration tests using React Testing Library.
- **Backend**: Unit tests for each API endpoint, and integration tests with Django’s testing tools.
- **End-to-End Testing**: Optional testing of core flows using Cypress or Selenium.

---
