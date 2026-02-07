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
  const res = await fetch(url.toString(), {
    headers: deviceId ? { "X-Device-Id": deviceId } : {},
  });
  if (!res.ok) {
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    const message =
      data?.detail?.message ||
      data?.detail ||
      (typeof data === "string" ? data : null) ||
      `Backend error ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.rateLimit = data?.detail?.rate_limit || data?.rate_limit || null;
    throw err;
  }
  return res.json();
}
export async function reverseGeocode({ lat, lon }) {
  const url = `${BASE}/reverse-geocode?lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`reverseGeocode failed: ${res.status}`);
  return res.json();
}
