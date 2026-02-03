import { useState } from "react";
import MapPicker from "./components/MapPicker";
import WeatherCard from "./components/WeatherCard";
import { fetchWeather } from "./api";

function getUnitSymbol(units) {
  if (units === "metric") return "°C";
  if (units === "imperial") return "°F";
  return "K";
}

export default function App() {
  const [coords, setCoords] = useState(null);
  const [units, setUnits] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function onGetWeather() {
    if (!coords) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetchWeather({
        lat: coords.lat,
        lon: coords.lon,
        units,
      });
      setData(res);
    } catch (e) {
      setError(e?.message || String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const current = data?.current;
  const unit = getUnitSymbol(units);

  const iconUrl = current?.icon
    ? `https://openweathermap.org/img/wn/${current.icon}@2x.png`
    : null;

  return (
    <div className="root">
      <MapPicker value={coords} onPick={setCoords} />

      <div className="panel">
        <div className="panelTitle">Weather</div>

        <div className="row">
          <div className="label">Location</div>
          <div className="value">
            {coords
              ? `lat ${coords.lat.toFixed(5)}, lon ${coords.lon.toFixed(5)}`
              : "Click on the map"}
          </div>
        </div>

        <div className="row">
          <div className="label">Units</div>
          <select value={units} onChange={(e) => setUnits(e.target.value)}>
            <option value="metric">metric (°C)</option>
            <option value="imperial">imperial (°F)</option>
            <option value="standard">standard (K)</option>
          </select>
        </div>

        <button className="btn" disabled={!coords || loading} onClick={onGetWeather}>
          {loading ? "Loading..." : "Get Weather"}
        </button>

        {error && <div className="error">{error}</div>}

        {/* 👇 כאן רק קומפוננטה, לא HTML */}
        <WeatherCard
          current={current}
          iconUrl={iconUrl}
          units={units}
          unitSymbol={unit}
          coords={coords}
          loading={loading}
          onRefresh={onGetWeather}
        />
      </div>
    </div>
  );
}
