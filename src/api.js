const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function fetchWeather({ lat, lon, units = "metric" }) {
  const url = new URL(`${BASE}/weather`);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("units", units);

  const r = await fetch(url.toString());
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Backend error ${r.status}: ${text}`);
  }
  return r.json();
}
export async function reverseGeocode({ lat, lon }) {
  // OpenStreetMap Nominatim (no key). For production, add caching/throttling.
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      // Some services like having a UA; browser may ignore, but fine:
      "User-Agent": "weatherapp-frontend",
    },
  });
  if (!res.ok) throw new Error(`reverseGeocode failed: ${res.status}`);
  return res.json();
}

