const BASE = "/api";
const DEVICE_ID_KEY = "weather_device_id";
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

function getDeviceId() {
  try {
    let existing = localStorage.getItem(DEVICE_ID_KEY);

    if (!existing) {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        existing = crypto.randomUUID();
      } else {
        existing = `dev-${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}`;
      }

      localStorage.setItem(DEVICE_ID_KEY, existing);
    }

    return existing;
  } catch {
    return "";
  }
}

export async function fetchWeather({
  lat,
  lon,
  units = "metric",
}) {
  const url =
    `${BASE}/weather?lat=${lat}&lon=${lon}&units=${units}`;

  const deviceId = getDeviceId();

  const res = await fetch(url, {
    headers: deviceId
      ? { "X-Device-Id": deviceId }
      : {},
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
    err.rateLimit =
      data?.detail?.rate_limit ||
      data?.rate_limit ||
      null;

    throw err;
  }

  return res.json();
}

export async function reverseGeocodeMapTiler({
  lat,
  lon,
  signal,
}) {
  if (!MAPTILER_KEY) {
    throw new Error("VITE_MAPTILER_API_KEY is missing");
  }

  const url =
    `https://api.maptiler.com/geocoding/${lon},${lat}.json` +
    `?key=${MAPTILER_KEY}&language=en&limit=1`;

  const res = await fetch(url, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `MapTiler reverse geocoding failed: ${res.status}`
    );
  }

  const data = await res.json();
  const feature = data?.features?.[0];

  if (!feature) {
    return {
      name: "Selected location",
      display_name: "Selected location",
    };
  }

  const name =
    feature.place_name ||
    feature.text ||
    feature.properties?.name ||
    "Selected location";

  return {
    name,
    display_name: name,
  };
}

export async function searchLocations(query) {
  const params = new URLSearchParams({
    q: query,
    limit: "5",
  });

  const res = await fetch(
    `${BASE}/geocode?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      `searchLocations failed: ${res.status}`
    );
  }

  return res.json();
}