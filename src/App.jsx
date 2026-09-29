import { useRef, useState } from "react";

import MapPicker from "./components/MapPicker";
import WeatherCard from "./components/WeatherCard";

import {
  fetchWeather,
  reverseGeocodeMapTiler,
  searchLocations,
} from "./api";

const FALLBACK_DAILY_LIMIT = 999;

function getUnitSymbol(units) {
  if (units === "metric") {
    return `${String.fromCharCode(176)}C`;
  }

  if (units === "imperial") {
    return `${String.fromCharCode(176)}F`;
  }

  return "K";
}

export default function App() {
  const [coords, setCoords] = useState(null);
  const [units, setUnits] = useState("metric");

  const [loading, setLoading] = useState(false);
  const [resolvingPlace, setResolvingPlace] = useState(false);

  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [locationResults, setLocationResults] = useState([]);

  const [data, setData] = useState(null);
  const [place, setPlace] = useState("");
  const [rateInfo, setRateInfo] = useState(null);

  const reverseControllerRef = useRef(null);

  const requestCount = rateInfo
    ? Math.max(
        rateInfo.ip_count,
        rateInfo.device_count,
        rateInfo.pair_count
      )
    : 0;

  const dailyLimit =
    rateInfo?.limit ?? FALLBACK_DAILY_LIMIT;

  async function onMapPick(position) {
    const lat = Number(position.lat);
    const lon = Number(position.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return;
    }

    if (reverseControllerRef.current) {
      reverseControllerRef.current.abort();
    }

    const controller = new AbortController();
    reverseControllerRef.current = controller;

    setCoords({ lat, lon });
    setPlace("");
    setResolvingPlace(true);

    setData(null);
    setError("");
    setSearchError("");
    setLocationResults([]);

    try {
      const result = await reverseGeocodeMapTiler({
        lat,
        lon,
        signal: controller.signal,
      });

      const name =
        result?.display_name ||
        result?.name ||
        "Selected location";

      setPlace(name);
    } catch (e) {
      if (e?.name === "AbortError") {
        return;
      }

      setPlace("Selected location");
    } finally {
      if (reverseControllerRef.current === controller) {
        setResolvingPlace(false);
      }
    }
  }

  async function onSearchLocation(event) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (query.length < 2) {
      setSearchError("Enter at least 2 characters.");
      setLocationResults([]);
      return;
    }

    setSearching(true);
    setSearchError("");

    try {
      const results = await searchLocations(query);

      setLocationResults(results);

      if (!results.length) {
        setSearchError("No matching locations found.");
      }
    } catch (e) {
      setSearchError(e?.message || String(e));
      setLocationResults([]);
    } finally {
      setSearching(false);
    }
  }

  function onSelectLocation(result) {
    const lat = Number(result.lat);
    const lon = Number(result.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return;
    }

    if (reverseControllerRef.current) {
      reverseControllerRef.current.abort();
    }

    const name =
      result.display_name_en ||
      result.name ||
      result.display_name ||
      "Selected location";

    setCoords({ lat, lon });
    setPlace(name);
    setResolvingPlace(false);

    setData(null);
    setError("");
    setSearchError("");
    setLocationResults([]);
    setSearchQuery(name);
  }

  async function onGetWeather() {
    if (!coords) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetchWeather({
        lat: coords.lat,
        lon: coords.lon,
        units,
      });

      setData(res);

      if (res?.rate_limit) {
        setRateInfo(res.rate_limit);
      }
    } catch (e) {
      setError(e?.message || String(e));

      if (e?.rateLimit) {
        setRateInfo(e.rateLimit);
      }

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
      <MapPicker
        value={coords}
        onPick={onMapPick}
      />

      <WeatherCard
        place={place}
        coords={coords}
        resolvingPlace={resolvingPlace}
        units={units}
        setUnits={setUnits}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searching={searching}
        searchError={searchError}
        locationResults={locationResults}
        onSearchLocation={onSearchLocation}
        onSelectLocation={onSelectLocation}
        loading={loading}
        error={error}
        current={current}
        iconUrl={iconUrl}
        unitSymbol={unitSymbol}
        onGetWeather={onGetWeather}
        requestCount={requestCount}
        dailyLimit={dailyLimit}
        rateInfo={rateInfo}
      />
    </div>
  );
}