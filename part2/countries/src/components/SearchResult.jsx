import { useState, useEffect } from "react";
import CountryInfo from "./CountryInfo.jsx";

/** components */
const ResultRow = ({ country, showCountryHandler }) => {
  return (
    <li style={{ listStyle: "none" }}>
      {country.name.common}{" "}
      <button onClick={() => showCountryHandler(country)}>Show</button>
    </li>
  );
};

const SearchResult = ({ countries }) => {
  /** states */
  const [countryToShow, setCountryToShow] = useState(null);

  /** effects */
  useEffect(() => {
    if (countries && countries.length === 1) {
      setCountryToShow(countries[0]);
    } else {
      setCountryToShow(null);
    }
  }, [countries]);

  /** functions */
  const showCountryHandler = (country) => {
    setCountryToShow(country);
  };

  /** JSX */
  if (countryToShow) {
    return <CountryInfo country={countryToShow} />;
  }

  if (countries && countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries && countries.length > 1) {
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
  }

  return <p>No countries found</p>;
};

export default SearchResult;
