import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar.jsx";
import Result from "./components/Result.jsx";

const App = () => {
  /** states */
  const [value, setValue] = useState("");
  const [queries, setQueries] = useState(null);
  const [queriedCountries, setQueriedCountries] = useState(null);
  const [countryToShow, setCountryToShow] = useState(null);
  const [weatherLocation, setWeatherLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  /** effects */
  useEffect(() => {
    if (!queries) return;
    // console.log("fetching country info...");
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const filtered = response.data.filter((country) => {
          if (queries[1].length > 0) {
            return (
              country.name.common.includes(queries[0]) ||
              country.name.common.includes(queries[1])
            );
          } else {
            return country.name.common.includes(queries[0]);
          }
        });
        setQueriedCountries(filtered);
      })
      .catch((error) => console.log(error.message));
  }, [queries]);

  useEffect(() => {
    if (!countryToShow) return;
    // console.log("showing country info...");
    setQueriedCountries([countryToShow]);
    setWeatherLocation([
      countryToShow.capital,
      countryToShow.cca2.toLowerCase(),
    ]);
    setWeatherData(null); // reset weather data when showing a new country
  }, [countryToShow]);

  // Ensure countryToShow is updated when queriedCountries changes
  useEffect(() => {
    if (
      queriedCountries &&
      queriedCountries.length === 1 &&
      (!countryToShow || countryToShow.cca3 !== queriedCountries[0].cca3)
    ) {
      setCountryToShow(queriedCountries[0]);
    }
  }, [queriedCountries, countryToShow]);

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

  /** functions */
  const showCountryHandler = (country) => {
    // console.log(country);
    setCountryToShow(country);
  };
  const handleValueChange = (evt) => {
    // console.log(evt.target.value);
    setValue(evt.target.value);
    // query(value); -> since the update of the state(setValue) is async
    // , use evt.target.value for the argument of query fn
    query(evt.target.value);
  };

  const query = (value) => {
    const beforeCapitalized = value.trim();
    // console.log(beforeCapitalized);
    let capitalizedQuery = "";
    if (beforeCapitalized.length > 0) {
      capitalizedQuery =
        beforeCapitalized[0].toUpperCase() + beforeCapitalized.slice(1);
      // console.log(capitalizedQuery);
    }

    setQueries([beforeCapitalized, capitalizedQuery]);
  };

  return (
    <div className="container">
      <SearchBar onChange={handleValueChange} />
      <Result
        countries={queriedCountries}
        showCountryHandler={showCountryHandler}
        weatherData={weatherData}
      />
    </div>
  );
};

export default App;
