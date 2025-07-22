import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar.jsx";
import SearchResult from "./components/SearchResult.jsx";

const App = () => {
  /** states */
  const [queries, setQueries] = useState(null); // queries[0]: raw, queries[1]: capitalized
  const [queriedCountries, setQueriedCountries] = useState(null);

  /** effects */
  useEffect(() => {
    if (!queries) return;
    // console.log("fetching country info...");
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const filtered = response.data.filter((country) => {
          return queries[1].length > 0
            ? country.name.common.includes(queries[0]) ||
                country.name.common.includes(queries[1])
            : country.name.common.includes(queries[0]);
        });
        setQueriedCountries(filtered);
      })
      .catch((error) => console.log(error.message));
  }, [queries]);

  /** functions */
  function debounce(fn, ms) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  const handleValueChange = (evt) => {
    // query(value); -> since the update of the state(setValue) is async
    // , use evt.target.value for the argument of query fn
    // console.log(evt.target.value);
    setQueries(query(evt.target.value));
  };

  const debouncedHandleValueChange = debounce(handleValueChange, 500);

  const query = (value) => {
    const beforeCapitalized = value.trim();
    let capitalizedQuery = "";
    if (beforeCapitalized.length > 0) {
      capitalizedQuery =
        beforeCapitalized[0].toUpperCase() + beforeCapitalized.slice(1);
    }

    return [beforeCapitalized, capitalizedQuery];
  };

  /** JSX */
  return (
    <div className="container">
      <SearchBar onChange={debouncedHandleValueChange} />
      <SearchResult countries={queriedCountries} />
    </div>
  );
};

export default App;
