import "./WeatherCard.css";

function getThemeClass(icon) {
  const v = String(icon || "").toLowerCase();
  // OpenWeather icons: 01d, 02d, 09d, 10d, 11d, 13d, 50d...
  if (v.startsWith("01")) return "is-sunny";
  if (v.startsWith("02") || v.startsWith("03") || v.startsWith("04")) return "is-cloudy";
  if (v.startsWith("09") || v.startsWith("10")) return "is-rain";
  if (v.startsWith("11")) return "is-storm";
  if (v.startsWith("13")) return "is-snow";
  return "is-cloudy";
}

export default function WeatherCard({
  place,
  coords,
  units,
  setUnits,
  searchQuery,
  setSearchQuery,
  searching,
  searchError,
  locationResults,
  onSearchLocation,
  onSelectLocation,
  loading,
  error,
  current,
  iconUrl,
  unitSymbol,
  onGetWeather,
  requestCount,
  dailyLimit,
  rateInfo,
}) {
  const theme = getThemeClass(current?.icon);
  const effectiveLimit = Number.isFinite(dailyLimit) && dailyLimit > 0 ? dailyLimit : 999;
  const usedPercent = Math.min(100, Math.round((requestCount / effectiveLimit) * 100));

  const titleText = place
    ? place
    : coords
      ? `lat ${coords.lat.toFixed(5)}, lon ${coords.lon.toFixed(5)}`
      : "Choose a location";

  const buttonLabel = loading
    ? "Loading..."
    : requestCount >= effectiveLimit
      ? "Limit reached"
      : current
        ? "Refresh"
        : "Get Weather";

  return (
    <div className="weatherDock">
      <div className={`weatherCard ${theme}`}>
        <div className="weatherHeader">
          <div className="weatherTitle">
            <div className="weatherPlace">{titleText}</div>
            <div className="weatherMeta">
              <span>{units}</span>
              <span>{current?.description || "Waiting for a forecast"}</span>
            </div>
          </div>

          <button
            className="weatherBtn"
            disabled={!coords || loading || requestCount >= effectiveLimit}
            onClick={onGetWeather}
            title={
              !coords
                ? "Pick a location on the map"
                : requestCount >= effectiveLimit
                  ? `Daily request limit reached (${effectiveLimit})`
                  : "Get weather"
            }
          >
            {buttonLabel}
          </button>
        </div>

        <div className="weatherControls">
          <form className="searchForm" onSubmit={onSearchLocation}>
            <input
              className="searchInput"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, country, or address"
              autoComplete="off"
            />
            <button className="searchBtn" type="submit" disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </button>
          </form>

          {searchError ? <div className="wcError">{searchError}</div> : null}

          {locationResults.length ? (
            <div className="searchResults">
              {locationResults.map((result) => (
                <button
                  className="searchResult"
                  key={`${result.place_id}-${result.lat}-${result.lon}`}
                  type="button"
                  onClick={() => onSelectLocation(result)}
                >
                  <span className="searchResultName">{result.display_name}</span>
                  <span className="searchResultCoords">
                    {Number(result.lat).toFixed(5)}, {Number(result.lon).toFixed(5)}
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          <div className="wcRow">
            <div className="wcLabel">Units</div>
            <select
              className="wcSelect"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            >
              <option value="metric">metric (°C)</option>
              <option value="imperial">imperial (°F)</option>
              <option value="standard">standard (K)</option>
            </select>
          </div>

          {error ? <div className="wcError">{error}</div> : null}
        </div>

        <div className="usage">
          <div className="usageText">
            <span>Daily usage</span>
            <strong>
              {requestCount} / {effectiveLimit}
            </strong>
          </div>
          <div className="usageTrack" aria-hidden="true">
            <div className="usageFill" style={{ width: `${usedPercent}%` }} />
          </div>
          {rateInfo?.blocked ? (
            <div className="usageNote">Limit resets with the next daily window.</div>
          ) : null}
        </div>

        {current ? (
          <div className="weatherBody">
            <div className="weatherMain">
              <div className="weatherMainRow">
                <div>
                  <div className="weatherTemp">
                    {current.temp ?? "—"}
                    <span className="unitInline">{unitSymbol}</span>
                  </div>
                  <div className="weatherDesc">{current.description || "—"}</div>
                </div>

                <div className="weatherIconWrap">
                  {iconUrl ? (
                    <img src={iconUrl} alt={current.description || "weather"} loading="lazy" />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="weatherSide">
              <div className="weatherChip">
                <div className="weatherChipLabel">Feels like</div>
                <div className="weatherChipValue">
                  {current.feels_like ?? "—"} {unitSymbol}
                </div>
              </div>

              <div className="weatherChip">
                <div className="weatherChipLabel">Humidity</div>
                <div className="weatherChipValue">{current.humidity ?? "—"}%</div>
              </div>

              <div className="weatherChip">
                <div className="weatherChipLabel">Wind</div>
                <div className="weatherChipValue">{current.wind_speed ?? "—"}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="weatherEmpty">
            <div className="emptyTitle">Start with the map</div>
            <div className="emptyCopy">
              Drop a marker anywhere, choose units, and fetch the current conditions.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
