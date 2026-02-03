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
  loading,
  error,
  current,
  iconUrl,
  unitSymbol,
  onGetWeather,
}) {
  const theme = getThemeClass(current?.icon);

  const titleText = place
    ? place
    : coords
      ? `lat ${coords.lat.toFixed(5)}, lon ${coords.lon.toFixed(5)}`
      : "Click on the map";

  return (
    <div className="weatherDock">
      <div className={`weatherCard ${theme}`}>
        <div className="weatherHeader">
          <div className="weatherTitle">
            <div className="weatherPlace">{titleText}</div>
            <div className="weatherMeta">
              <span>{units}</span>
              <span>{current?.description || "No data yet"}</span>
            </div>
          </div>

          <button
            className="weatherBtn"
            disabled={!coords || loading}
            onClick={onGetWeather}
            title={!coords ? "Pick a location on the map" : "Get weather"}
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>

        <div className="weatherControls">
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
            Pick a point on the map, then click <b>Get Weather</b>.
          </div>
        )}
      </div>
    </div>
  );
}
