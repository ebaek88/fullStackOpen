import { useState, useEffect } from "react";
import axios from "axios";

const CountryInfo = ({ country }) => {
  /** states */
  const [weatherLocation, setWeatherLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  /** effects */
  useEffect(() => {
    if (!country) return;
    // console.log("showing country info...");
    setWeatherLocation([country.capital, country.cca2.toLowerCase()]);
    setWeatherData(null); // reset weather data when showing a new country
  }, [country]);

  useEffect(() => {
    if (!weatherLocation || weatherLocation.length === 0) return;
    // console.log("fetching weather info...");
    const api_key = import.meta.env.VITE_API_KEY;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${weatherLocation[0]},${weatherLocation[1]}&units=metric&exclude=minutely&appid=${api_key}`
      )
      .then((response) => {
        // console.log(response);
        setWeatherData({ ...response.data });
        // console.log(weatherData);
      })
      .catch((error) => console.log(error.message));
  }, [weatherLocation]);

  const languages = [];
  for (const language in country.languages) {
    languages.push(<li key={language}>{country.languages[language]}</li>);
  }

  /** JSX */
  return (
    <div className="country-container">
      <div className="country-info">
        <h1>{country.name.common}</h1>
        <div>
          <p>Capital: {country.capital}</p>
          <p>Area(in km^2): {country.area}</p>
        </div>
        <h2>Languages</h2>
        <ul>{languages}</ul>
        <img src={country.flags.png} alt={country.flags.alt} />
      </div>
      {weatherData && (
        <div className="country-weather">
          <h2>Weather in {weatherData.name}</h2>
          <p>{weatherData.weather[0].description}</p>
          <p>Current Temperature: {weatherData.main.temp} Celsius</p>
          <p>
            Lowest Temperature of the day: {weatherData.main.temp_min} Celsius
          </p>
          <p>
            Highest Temperature of the day: {weatherData.main.temp_max} Celsius
          </p>
          <div className="weather-icon">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
          </div>
          <p>Wind: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default CountryInfo;
