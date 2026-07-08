# Weather App Frontend

React + Vite frontend for the Weather App project. The app lets a user pick any location on a map, request the current weather, and see their daily request usage.

## What This App Does

- Shows an interactive Leaflet map.
- Lets the user click or drag a marker to choose coordinates.
- Lets the user search for a city, country, or address and select a matching result.
- Fetches current weather from the backend.
- Fetches a readable place name for the selected coordinates.
- Displays place name, temperature, weather condition, humidity, wind, and feels-like temperature.
- Supports metric, imperial, and standard units.
- Stores a generated device id in `localStorage` for backend rate limiting.
- Shows daily usage based on the backend rate-limit response.
- Uses nginx in the Docker image to serve the built app and proxy `/api/*` to the backend.

## Tech Stack

- React 19
- Vite 7
- Leaflet
- React-Leaflet
- Nginx
- Docker

## How It Connects To The Backend

The frontend API client uses relative URLs:

```text
/api/weather
/api/geocode
/api/reverse-geocode
```

In Docker, nginx forwards those requests to the backend service:

```text
/api/* -> http://backend:8000/*
```

The frontend automatically sends `X-Device-Id` on weather requests. The backend uses that value for daily rate limiting.

## Run With Docker Compose

The full project is intended to run from the parent `weatherapp/` folder with the root `docker-compose.yml`.

```bash
docker compose up --build
```

Frontend URL:

```text
http://localhost
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

For local development, the app still calls `/api/*`, so run it behind the project proxy setup or add a Vite proxy if you want to call the backend directly during development.

## Build

```bash
npm run build
```

The production build is written to `dist/`.

## Lint

```bash
npm run lint
```

## Notes

- `node_modules/`, `dist/`, logs, local env files, and editor files are ignored.
- The displayed location names come from the backend reverse-geocode endpoint.
- Country and place names are returned in English because the backend forces English reverse-geocoding responses.
