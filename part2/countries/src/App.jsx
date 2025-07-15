import { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ onChange }) => {
  return (
    <div>
      find countries <input type="text" onChange={onChange} />
    </div>
  );
};

const ResultRow = () => {
  return <li style={{ listStyle: "none" }}></li>;
};

const Result = ({ results }) => {
  return <ul>{}</ul>;
};

const App = () => {
  /** states */
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState(null);

  const handleChange = (evt) => {
    console.log(evt.target.value);
    setValue(evt.target.value);
    query(value);
  };

  const query = async (value) => {
    const response = await axios.get(
      "https://studies.cs.helsinki.fi/restcountries/api/all"
    );
    const queryData = response.data.filter((country) =>
      country.name.common.includes(value)
    );
    console.log(queryData);
  };

  return (
    <div>
      <SearchBar onChange={handleChange} />
      <Result />
    </div>
  );
};

export default App;
