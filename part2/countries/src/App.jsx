import { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ onChange }) => {
  return (
    <div>
      find countries <input type="text" onChange={onChange} />
    </div>
  );
};

const ResultRow = ({ name }) => {
  return <li style={{ listStyle: "none" }}>{name}</li>;
};

const CountryInfo = ({ country }) => {
  const languages = [];
  for (const language in country.languages) {
    languages.push(<li>{country.languages[language]}</li>);
  }

  return (
    <>
      <h1>{country.name.common}</h1>
      <div>
        <p>Capital: {country.capital}</p>
        <p>Area(in km^2): {country.area}</p>
      </div>
      <h2>Languages</h2>
      <ul>{languages}</ul>
      <img src={country.flags.png} alt={country.flags.alt} />
    </>
  );
};

const Result = ({ countries }) => {
  if (countries && countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries && countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => (
          <ResultRow key={country.cca3} name={country.name.common} />
        ))}
      </ul>
    );
  } else if (countries && countries.length === 1) {
    // If only one country is found.
    const country = countries[0];
    return <CountryInfo country={country} />;
  } else {
    return <p>No countries found</p>;
  }
};

const App = () => {
  /** states */
  const [value, setValue] = useState("");
  const [queries, setQueries] = useState(null);
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    if (queries !== null) {
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
          setCountries(filtered);
        })
        .catch((error) => console.log(error.message));
    }
  }, [queries]);

  const handleChange = (evt) => {
    console.log(evt.target.value);
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
    <div>
      <SearchBar onChange={handleChange} />
      <Result countries={countries} />
    </div>
  );
};

export default App;
