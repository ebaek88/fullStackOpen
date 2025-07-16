const ResultRow = ({ country, showCountryHandler }) => {
  return (
    <li style={{ listStyle: "none" }}>
      {country.name.common}{" "}
      <button onClick={() => showCountryHandler(country)}>Show</button>
    </li>
  );
};

const CountryInfo = ({ country, weatherData }) => {
  const languages = [];
  for (const language in country.languages) {
    languages.push(<li key={language}>{country.languages[language]}</li>);
  }

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

const Result = ({ countries, showCountryHandler, weatherData }) => {
  if (countries && countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries && countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => (
          <ResultRow
            key={country.cca3}
            country={country}
            showCountryHandler={showCountryHandler}
          />
        ))}
      </ul>
    );
  } else if (countries && countries.length === 1) {
    // If only one country is found.
    const country = countries[0];
    return <CountryInfo country={country} weatherData={weatherData} />;
  } else {
    return <p>No countries found</p>;
  }
};

export default Result;
