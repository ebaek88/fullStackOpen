const ResultRow = ({ country, showCountryHandler }) => {
  return (
    <li style={{ listStyle: "none" }}>
      {country.name.common}{" "}
      <button onClick={() => showCountryHandler(country)}>Show</button>
    </li>
  );
};

const CountryInfo = ({ country, weatherData }) => {
  console.log(country);
  console.log(weatherData.weather[0]);
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
      <div className="country-weather">
        <h2>Weather in {country.capital}</h2>
        Temperature: {weatherData.main.temp}
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt={weatherData.current.weather[0].description}
        />
        Wind: {weatherData.wind.speed}
      </div>
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
