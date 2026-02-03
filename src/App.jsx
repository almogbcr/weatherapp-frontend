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
  const unitSymbol = getUnitSymbol(units);

  const iconUrl = current?.icon
    ? `https://openweathermap.org/img/wn/${current.icon}@2x.png`
    : null;

  return (
    <div className="root">
      <MapPicker value={coords} onPick={setCoords} />

      <WeatherCard
        coords={coords}
        units={units}
        setUnits={setUnits}
        loading={loading}
        error={error}
        current={current}
        iconUrl={iconUrl}
        unitSymbol={unitSymbol}
        onGetWeather={onGetWeather}
      />
    </div>
  );
}
