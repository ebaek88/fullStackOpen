import { useDispatch } from "react-redux";
import { filterChange } from "../reducers/filterReducer.js";

const Filter = () => {
  const dispatch = useDispatch();

  // Handler for input change
  const handleChange = (evt) => {
    dispatch(filterChange(evt.target.value));
  };

  const style = { marginBottom: 10 };

  return (
    <div style={style}>
      <label>
        filter
        <input type="text" onChange={handleChange} />
      </label>
    </div>
  );
};

export default Filter;
