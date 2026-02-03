import { useState } from "react";
import MapPicker from "./components/MapPicker";
import { fetchWeather } from "./api";

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
      const res = await fetchWeather({ lat: coords.lat, lon: coords.lon, units });
      setData(res);
    } catch (e) {
      setError(e?.message || String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const current = data?.current;

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

        {current && (
          <div className="card">
            <div className="big">
              {current.temp ?? "—"}
              <span className="unit">
                {units === "metric" ? "°C" : units === "imperial" ? "°F" : "K"}
              </span>
            </div>
            <div className="desc">{current.description || "—"}</div>

            <div className="grid">
              <div>
                <div className="k">Feels</div>
                <div className="v">{current.feels_like ?? "—"}</div>
              </div>
              <div>
                <div className="k">Humidity</div>
                <div className="v">{current.humidity ?? "—"}%</div>
              </div>
              <div>
                <div className="k">Wind</div>
                <div className="v">{current.wind_speed ?? "—"}</div>
              </div>
              <div>
                <div className="k">Icon</div>
                <div className="v">{current.icon ?? "—"}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
