import { useState } from "react";
import MapPicker from "./components/MapPicker";
import WeatherCard from "./components/WeatherCard";
import { fetchWeather, reverseGeocode } from "./api";

const FALLBACK_DAILY_LIMIT = 999;

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
  const [place, setPlace] = useState("");
  const [rateInfo, setRateInfo] = useState(null);
  const requestCount = rateInfo
    ? Math.max(rateInfo.ip_count, rateInfo.device_count, rateInfo.pair_count)
    : 0;
  const dailyLimit = rateInfo?.limit ?? FALLBACK_DAILY_LIMIT;


  async function onGetWeather() {
    if (!coords) return;

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
      if (res?.rate_limit) setRateInfo(res.rate_limit);

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
      if (e?.rateLimit) setRateInfo(e.rateLimit);
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
        dailyLimit={dailyLimit}
      />
    </div>
  );
}
