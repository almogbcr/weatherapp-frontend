# Weather App Frontend

React + Vite UI for selecting a map location and fetching weather data from the backend.

## Features
- Interactive map picker (Leaflet).
- Weather display for selected coordinates.
- Reverse geocoding for location naming.
- Client-side device ID generation for backend rate limiting.
- Nginx reverse proxy for `/api/*` in containerized runs.

## Tech Stack
- React 19
- Vite 7
- Leaflet + React-Leaflet
- Nginx (in Docker image)

## Prerequisites
- Node.js 20+ (recommended)
- npm

## Run With Docker (Recommended)
From `weatherapp/` root:

```bash
docker compose up --build
```

Frontend will be available at:
- `http://localhost`

In container mode, Nginx forwards:
- `/api/*` -> `http://backend:8000/*`

