import "./WeatherCard.css";

export default function WeatherCard() {
  return (
    <div className="weatherDock">
      <div className="weatherCard is-sunny">
        <div className="weatherHeader">
          <div className="weatherTitle">
            <div className="weatherPlace">Tel Aviv</div>
            <div className="weatherMeta">
              <span>Clear sky</span>
              <span>Updated now</span>
            </div>
          </div>
        </div>

        <div className="weatherBody">
          <div className="weatherMain">
            <div className="weatherMainRow">
              <div>
                <div className="weatherTemp">27°</div>
                <div className="weatherDesc">Sunny</div>
              </div>

              <div className="weatherIconWrap">
                <img
                  src="https://openweathermap.org/img/wn/01d@2x.png"
                  alt="sun"
                />
              </div>
            </div>
          </div>

          <div className="weatherSide">
            <div className="weatherChip">
              <div className="weatherChipLabel">Feels like</div>
              <div className="weatherChipValue">29°</div>
            </div>

            <div className="weatherChip">
              <div className="weatherChipLabel">Humidity</div>
              <div className="weatherChipValue">55%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
