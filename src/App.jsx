const MAX_REQUESTS = 999;
const STORAGE_KEY = "weather_request_count";


import { useState } from "react";
import MapPicker from "./components/MapPicker";
import WeatherCard from "./components/WeatherCard";
import { fetchWeather, reverseGeocode } from "./api";

function getUnitSymbol(units) {
  if (units === "metric") return "°C";
  if (units === "imperial") return "°F";
  return "K";
}

function getRequestCount() {
  return Number(localStorage.getItem(STORAGE_KEY) || 0);
}

function incrementRequestCount() {
  const next = getRequestCount() + 1;
  localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}


export default function App() {
  const [coords, setCoords] = useState(null);
  const [units, setUnits] = useState("metric");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState(null);
  const [place, setPlace] = useState("");

  const requestCount = getRequestCount();


  async function onGetWeather() {
    if (!coords) return;

     const count = getRequestCount();
  if (count >= MAX_REQUESTS) {
    setError("Daily request limit reached (999).");
    return;
  }

    setLoading(true);
    setError("");

    try {
      // 1) Weather (only on button click)
      const res = await fetchWeather({
        lat: coords.lat,
        lon: coords.lon,
        units,
      });
      setData(res);

      await incrementRequestCount();

      // 2) Place name (only on button click)
      try {
        const j = await reverseGeocode({ lat: coords.lat, lon: coords.lon });
        const name =
          j?.address?.city ||
          j?.address?.town ||
          j?.address?.village ||
          j?.address?.municipality ||
          j?.address?.state ||
          j?.display_name ||
          "";
        setPlace(name);
      } catch {
        setPlace("");
      }
    } catch (e) {
      setError(e?.message || String(e));
      setData(null);
      setPlace("");
    } finally {
      setLoading(false);
    }
  }

  const current = data?.current;
  const unitSymbol = getUnitSymbol(units);

  const iconUrl = current?.icon
    ? `https://openweathermap.org/img/wn/${current.icon}@2x.png`
    : null;

  return (
    <div className="root">
      <MapPicker value={coords} onPick={setCoords} />

      <WeatherCard
        place={place}
        coords={coords}
        units={units}
        setUnits={setUnits}
        loading={loading}
        error={error}
        current={current}
        iconUrl={iconUrl}
        unitSymbol={unitSymbol}
        onGetWeather={onGetWeather}
        requestCount={requestCount}
      />
    </div>
  );
}
