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
  const [weatherLocation, setWeatherLocation] = useState([64, 26]);
  const [weatherData, setWeatherData] = useState(null);

  /** effects */
  useEffect(() => {
    if (queries) {
      console.log("fetching country info...");
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
    }
  }, [queries]);

  useEffect(() => {
    if (countryToShow) {
      console.log("showing country info...");
      setQueriedCountries([countryToShow]);
      console.log(countryToShow.latlng);
      setWeatherLocation([...countryToShow.latlng]);
    }
  }, [countryToShow]);

  useEffect(() => {
    if (weatherLocation.length > 0) {
      console.log("fetching weather info...");
      const api_key = import.meta.env.VITE_API_KEY;
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${weatherLocation[0]}&lon=${weatherLocation[1]}&units=metric&exclude=minutely&appid=${api_key}`
        )
        .then((response) => {
          console.log(response);
          setWeatherData({ ...response.data });
          console.log(weatherData);
        })
        .catch((error) => console.log(error.message));
    }
  }, [weatherLocation]);

  /** functions */
  const showCountryHandler = (country) => setCountryToShow(country);

  const handleValueChange = (evt) => {
    // console.log(evt.target.value);
    setValue(evt.target.value);
    // query(value); -> since the update of the state(setValue) is async
    // , use evt.target.value for the argument of query fn
    query(evt.target.value);
  };

  const query = (value) => {
    const beforeCapitalized = value.trim();
    console.log(beforeCapitalized);
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
