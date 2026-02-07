const BASE = "/api";
const DEVICE_ID_KEY = "weather_device_id";

function getDeviceId() {
  try {
    let existing = localStorage.getItem(DEVICE_ID_KEY);
    if (!existing) {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        existing = crypto.randomUUID();
      } else {
        existing = `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      }
      localStorage.setItem(DEVICE_ID_KEY, existing);
    }
    return existing;
  } catch {
    return "";
  }
}

export async function fetchWeather({ lat, lon, units = "metric" }) {
const url = `${BASE}/weather?lat=${lat}&lon=${lon}&units=${units}`;

  const deviceId = getDeviceId();
  const r = await fetch(url.toString(), {
    headers: deviceId ? { "X-Device-Id": deviceId } : {},
  });
  if (!r.ok) {
    let data = null;
    try {
      data = await r.json();
    } catch {
      data = null;
    }
    const message =
      data?.detail?.message ||
      data?.detail ||
      (typeof data === "string" ? data : null) ||
      `Backend error ${r.status}`;
    const err = new Error(message);
    err.status = r.status;
    err.rateLimit = data?.detail?.rate_limit || data?.rate_limit || null;
    throw err;
  }
  return r.json();
}
export async function reverseGeocode({ lat, lon }) {
  // OpenStreetMap Nominatim (no key). For production, add caching/throttling.
  const url = `${BASE}/reverse-geocode?lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`reverseGeocode failed: ${res.status}`);
  return res.json();
}
